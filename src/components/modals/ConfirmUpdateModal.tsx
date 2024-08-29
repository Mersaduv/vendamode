import { Modal, Button } from '@/components/ui'

interface Props {
  title: string
  isLoading: boolean
  isShow: boolean
  onClose: () => void
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmUpdateModal: React.FC<Props> = (props) => {
  // ? Props
  const { title, isLoading, isShow, onClose, onConfirm, onCancel } = props

  // ? Render(s)
  return (
    // <Modal isShow={isShow} onClose={onClose} effect="ease-out">
    //   <Modal.Content onClose={onClose}>
    //     <Modal.Body>
    //       <div className="space-y-4 bg-white px-3 py-6 text-center md:rounded-lg">
    //         <p>
    //           آیا موافق به بازگردانی <span className="font-bold text-green-500">{title}</span> مد نظر هستید؟
    //         </p>
    //         <div className="flex justify-center gap-x-20">
    //           <Button onClick={onConfirm} isLoading={isLoading}>
    //             انجام
    //           </Button>

    //           <Button className="!bg-red-500" onClick={onCancel}>
    //             لغو
    //           </Button>
    //         </div>
    //       </div>
    //     </Modal.Body>
    //   </Modal.Content>
    // </Modal>
    <>
      <Modal isShow={isShow} onClose={onClose} effect="ease-out">
        <Modal.Content onClose={onClose}>
          <Modal.Body>
            <div className="space-y-8 flex flex-col w-[70%] bg-white px-3 py-6 text-center md:rounded-lg pt-10">
              <div className="flex justify-center">
                <img className="w-36" src="/gifs/7211795.gif" alt="" />
              </div>
              آیا موافق به بازگردانی {title} مد نظر هستید؟
              <div className="flex justify-center gap-x-3">
                <Button className="bg-red-500 rounded" onClick={onConfirm} isLoading={isLoading}>
                  بله
                </Button>

                <Button className="bg-gray-300 rounded" onClick={onCancel}>
                  خیر
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default ConfirmUpdateModal
