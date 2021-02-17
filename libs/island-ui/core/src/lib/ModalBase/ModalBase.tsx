import React, {
  FC,
  Ref,
  forwardRef,
  useState,
  useLayoutEffect,
  ReactElement,
  useEffect,
} from 'react'
import cn from 'classnames'
import {
  useDialogState,
  Dialog as BaseDialog,
  DialogBackdrop,
  DialogDisclosure,
  DialogProps,
} from 'reakit/Dialog'
import * as styles from './ModalBase.treat'
import { DisclosureProps } from 'reakit/ts'

interface BackdropDivProps {
  backdropWhite?: ModalBaseProps['backdropWhite']
}

export const BackdropDiv = forwardRef(
  (
    { backdropWhite, ...props }: DialogProps & BackdropDivProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const [mounted, setMounted] = useState(false)
    useLayoutEffect(function () {
      setMounted(true)
    }, [])

    return mounted ? (
      <div
        className={cn(
          styles.backdrop,
          styles.backdropColor[backdropWhite ? 'white' : 'default'],
        )}
        {...props}
        ref={ref}
      />
    ) : null
  },
)

export type ModalBaseProps = {
  /**
   * Element that opens the dialog.
   * It will be forwarded necessary props for a11y and event handling.
   */
  disclosure?: ReactElement
  /**
   * Unique ID for accessibility purposes
   */
  baseId: string
  className?: string
  /**
   * Default visibility state
   */
  initialVisibility?: boolean
  /**
   * Setting this to false automatically closes the modal
   */
  toggleClose?: boolean
  /**
   * Optional cb function that is fired when the modal visibility changes
   */
  onVisibilityChange?: (isVisible: boolean) => void
  renderDisclosure?: (
    disclosure: ReactElement,
    disclosureProps?: DisclosureProps,
  ) => ReactElement
  backdropWhite?: boolean
  /**
   * Aria label for the modal
   */
  modalLabel?: string
  /**
   * Remove the modal from dom when closed
   */
  removeOnClose?: boolean
  /**
   * toggle visibility, useful for controlling visibility from useState. Should be used with onVisibilityChange
   */
  isVisible?: boolean
}

export const ModalBase: FC<ModalBaseProps> = ({
  disclosure,
  baseId,
  initialVisibility,
  toggleClose,
  children,
  className,
  onVisibilityChange,
  renderDisclosure = (disclosure) => disclosure,
  backdropWhite,
  modalLabel,
  removeOnClose,
  isVisible,
}) => {
  const modal = useDialogState({
    animated: true,
    baseId,
    visible: initialVisibility || false,
  })
  const closeModal = () => modal.hide()

  // If the toggleClose flag has been set to true, we close the modal
  useEffect(() => {
    if (toggleClose) closeModal()
  }, [toggleClose])

  useEffect(() => {
    if (isVisible) {
      modal.show()
    } else if (isVisible === false) {
      modal.hide()
    }
  }, [isVisible])

  useEffect(() => {
    onVisibilityChange && onVisibilityChange(modal.visible)
  }, [modal.visible])
  const renderModal = !removeOnClose || (removeOnClose && modal.visible)
  return (
    <>
      {disclosure ? (
        <DialogDisclosure {...modal} {...disclosure.props}>
          {(disclosureProps: DisclosureProps) =>
            renderDisclosure(
              React.cloneElement(disclosure, disclosureProps),
              disclosureProps,
            )
          }
        </DialogDisclosure>
      ) : null}
      {renderModal && (
        <DialogBackdrop
          {...modal}
          as={BackdropDiv}
          backdropWhite={backdropWhite}
        >
          <BaseDialog
            {...modal}
            className={cn(styles.modal, className)}
            aria-label={modalLabel}
          >
            {typeof children === 'function'
              ? children({ closeModal })
              : children}
          </BaseDialog>
        </DialogBackdrop>
      )}
    </>
  )
}
