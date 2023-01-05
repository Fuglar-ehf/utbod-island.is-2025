import React, { FC, useState } from 'react'
import { useDebounce } from 'react-use'
import {
  Button,
  Box,
  Input,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Table as T } from '@island.is/island-ui/core'
import { PAGE_SIZE, pages, paginate } from './pagination'
import ViewStudent from '../ViewStudent/index'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import FindStudentModal from '../FindStudentModal/index'
import { useQuery } from '@apollo/client'
import { InstructorsStudentsQuery } from '../../graphql/queries'
import Skeleton from './Skeleton'
import { DrivingLicenseBookStudentForTeacher as Student } from '../../types/schema'
import { format as formatKennitala } from 'kennitala'
import * as styles from '../style.css'

const StudentsOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  /* table pagination */
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const { data, loading } = useQuery(InstructorsStudentsQuery)

  const [pageStudents, setPageStudents] = useState(
    data ? (data.drivingLicenseBookStudentsForTeacher as Array<Student>) : [],
  )

  /* table view */
  const [showTable, setShowTable] = useState(true)
  const [studentId, setStudentId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredStudents, setFilteredStudents] = useState<Array<Student>>()

  const handlePagination = (page: number, students: Array<Student>) => {
    setPage(page)
    setTotalPages(pages(students?.length))
    setFilteredStudents(students)
    setPageStudents(paginate(students, PAGE_SIZE, page))
  }

  const filter = (searchTerm: string) => {
    if (searchTerm.length) {
      const filteredList = data?.drivingLicenseBookStudentsForTeacher?.filter(
        (student: Student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.nationalId.includes(searchTerm),
      )

      handlePagination(1, filteredList)
    } else {
      handlePagination(1, data?.drivingLicenseBookStudentsForTeacher)
    }
  }

  useDebounce(
    () => {
      filter(searchTerm)
    },
    500,
    [data?.drivingLicenseBookStudentsForTeacher, searchTerm],
  )

  return (
    <Box marginBottom={10}>
      <Text variant="h2" marginBottom={3}>
        {showTable
          ? formatMessage(m.studentsOverviewTitle)
          : formatMessage(m.viewStudentTitle)}
      </Text>
      {showTable ? (
        <Stack space={5}>
          <Box
            display={['block', 'flex', 'flex']}
            justifyContent={'spaceBetween'}
          >
            <Box width="half" className={styles.mobileWidth}>
              <Input
                name="searchbar"
                placeholder={formatMessage(m.studentsOverviewSearchPlaceholder)}
                icon="search"
                backgroundColor="blue"
                size="sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
            <FindStudentModal
              application={application}
              setShowTable={setShowTable}
              setStudentId={setStudentId}
            />
          </Box>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>
                  {formatMessage(m.studentsOverviewTableHeaderCol1)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(m.studentsOverviewTableHeaderCol2)}
                </T.HeadData>
                <T.HeadData box={{ textAlign: 'center' }}>
                  {formatMessage(m.studentsOverviewTableHeaderCol3)}
                </T.HeadData>
                <T.HeadData></T.HeadData>
              </T.Row>
            </T.Head>
            {loading || (data && !pageStudents) ? (
              <Skeleton />
            ) : (
              <T.Body>
                {pageStudents && pageStudents.length ? (
                  pageStudents.map((student) => {
                    return (
                      <T.Row key={student.id}>
                        <T.Data>{student.name}</T.Data>
                        <T.Data>{formatKennitala(student.nationalId)}</T.Data>
                        <T.Data box={{ textAlign: 'center' }}>
                          {student.totalLessonCount ?? 0}
                        </T.Data>
                        <T.Data>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => {
                              setStudentId(student.nationalId)
                              setShowTable(false)
                            }}
                          >
                            {formatMessage(
                              m.studentsOverviewRegisterHoursButton,
                            )}
                          </Button>
                        </T.Data>
                      </T.Row>
                    )
                  })
                ) : (
                  <T.Row>
                    <T.Data>
                      {formatMessage(m.studentsOverviewNoStudentFound)}
                    </T.Data>
                    <T.Data></T.Data>
                    <T.Data></T.Data>
                    <T.Data></T.Data>
                  </T.Row>
                )}
              </T.Body>
            )}
          </T.Table>
          {pageStudents && pageStudents.length > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              renderLink={(page, className, children) => (
                <Box
                  cursor="pointer"
                  className={className}
                  onClick={() =>
                    handlePagination(page, filteredStudents as any)
                  }
                >
                  {children}
                </Box>
              )}
            />
          )}
        </Stack>
      ) : (
        <ViewStudent
          application={application}
          studentNationalId={studentId}
          setShowTable={setShowTable}
        />
      )}
    </Box>
  )
}

export default StudentsOverview
