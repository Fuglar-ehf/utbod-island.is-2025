import dynamic from 'next/dynamic'
import { ProjectPage } from '@island.is/web/graphql/schema'
import { FiskistofaFooter } from '@island.is/web/components'

const OpinberNyskopunFooter = dynamic(() =>
  import('./themes/OpinberNyskopun/OpinberNyskopunFooter').then(
    (mod) => mod.OpinberNyskopunFooter,
  ),
)

interface ProjectFooterProps {
  projectPage: ProjectPage
  namespace: Record<string, string>
}

export const ProjectFooter = ({
  projectPage,
  namespace,
}: ProjectFooterProps) => {
  const footerItems = projectPage.footerItems ?? []

  switch (projectPage.theme) {
    case 'opinbernyskopun':
      return (
        <OpinberNyskopunFooter
          footerItems={footerItems}
          namespace={namespace}
        />
      )
    case 'gagnasidur-fiskistofu':
      return (
        <FiskistofaFooter footerItems={footerItems} namespace={namespace} />
      )
    default:
      return null
  }
}
