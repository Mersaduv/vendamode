import { Modal, Button } from '@/components/ui'

interface Props {
  title: string
  deleted?: boolean
  isLoading: boolean
  isShow: boolean
  onClose: () => void
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDeleteModal: React.FC<Props> = (props) => {
  // ? Props
  const { title, isLoading, isShow, onClose, onCancel, onConfirm, deleted } = props

  // ? Render(s)
  return (
    <>
      <Modal isShow={isShow} onClose={onClose} effect="ease-out">
        <Modal.Content onClose={onClose}>
          <Modal.Body>
            {deleted ? (
              <div className="space-y-8 flex flex-col w-[70%] bg-white px-3 py-6 text-center md:rounded-lg pt-10">
                <div className="flex justify-center">
                  <img className="w-60" src="/gifs/delete.gif" alt="" />
                </div>
                <div className="text-lg">از حذف این فیلد مطمئن هستید؟</div>

                <div className="flex justify-center gap-x-3">
                  <Button className="bg-red-500 rounded" onClick={onConfirm} isLoading={isLoading}>
                    بله
                  </Button>

                  <Button className="bg-gray-300 rounded" onClick={onCancel}>
                    خیر
                  </Button>
                </div>
                <hr />
                <span className="pb-4 text-base text-red-500">در صورت حذف, امکان بازیابی وجود ندارد!!!</span>
              </div>
            ) : (
              <div className="space-y-8 flex flex-col w-[70%] bg-white px-3 py-6 text-center md:rounded-lg pt-10">
                <div className="flex justify-center">
                  <img className="w-36" src="/icons/trash.gif" alt="" />
                </div>
                <div className="text-lg">انتقال به زباله دان؟</div>
                <div className="flex justify-center gap-x-3">
                  <Button className="bg-red-500 rounded" onClick={onConfirm} isLoading={isLoading}>
                    بله
                  </Button>

                  <Button className="bg-gray-300 rounded" onClick={onCancel}>
                    خیر
                  </Button>
                </div>
                <hr />
                <span className="pb-4 text-base">در صورت حذف میتوانید از زباله دان بازیابی نمایید</span>
              </div>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default ConfirmDeleteModal
