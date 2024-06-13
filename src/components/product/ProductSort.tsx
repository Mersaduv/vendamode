import { useRouter } from 'next/router'

import { sorts } from '@/utils'

import { Check, Sort as SortIcon } from '@/icons'

import { useChangeRoute, useDisclosure } from '@/hooks'

import { Modal } from '@/components/ui'

interface Props {}

const ProductSort: React.FC<Props> = () => {
  // ? Assets
  const { query } = useRouter()
  const sortQuery = Number(query?.sort) || 1
  const pageQuery = Number(query?.page)

  const [isSort, sortHandlers] = useDisclosure()
  const changeRoute = useChangeRoute()

  // ? Handlers
  const handleSortChange = (item: (typeof sorts)[number]) => {
    changeRoute({
      page: pageQuery && pageQuery > 1 ? 1 : '',
      sort: item.value,
    })
    sortHandlers.close()
  }

  // ? Render(s)
  return (
    <>
      <div className="lg:hidden">
        <button type="button" className="flex items-center gap-x-1" onClick={sortHandlers.open}>
          <SortIcon className="icon h-6 w-6" />
          <span>{sorts[sortQuery - 1].name}</span>
        </button>

        <Modal isShow={isSort} onClose={sortHandlers.close} effect="buttom-to-fit">
          <Modal.Content
            onClose={sortHandlers.close}
            className="flex h-full flex-col gap-y-5 bg-white px-5 py-3 md:rounded-lg "
          >
            <Modal.Header onClose={sortHandlers.close}>مرتب سازی</Modal.Header>
            <Modal.Body>
              <div className="divide-y">
                {sorts.map((item, i) => (
                  <div key={i} className="flex items-center">
                    <button
                      className="block w-full py-3 text-right text-gray-700"
                      type="button"
                      name="sort"
                      onClick={() => handleSortChange(item)}
                    >
                      {item.name}
                    </button>
                    {sortQuery === item.value && <Check className="icon" />}
                  </div>
                ))}
              </div>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </div>
      <div className="hidden lg:flex lg:items-center w-full lg:gap-x-4 bg-[#f7f5f8] py-3 border-2 rounded-lg px-2">

        {sorts.map((item, i) => (
          <button
            key={i}
            className={`p-3 rounded text-sm ${sortQuery === item.value ? 'text-white bg-[#3F3A42]' : 'text-gray-600'}`}
            type="button"
            name="sort"
            onClick={() => handleSortChange(item)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </>
  )
}

export default ProductSort
