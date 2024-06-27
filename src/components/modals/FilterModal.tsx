import { Filter as FilterIcon } from '@/icons'

import { useDisclosure } from '@/hooks'

import { Button, Modal } from '@/components/ui'
import { ProductFilterControls, ProductSort } from '@/components/product'

interface Props {
  mainMaxPrice: number | undefined
  mainMinPrice: number | undefined
}

const FilterModal: React.FC<Props> = (props) => {
  // ? Props
  const { mainMinPrice, mainMaxPrice } = props

  // ? Assets
  const [isFilters, filtersHandlers] = useDisclosure()

  // ? Render(s)
  return (
    <>
      <Button onClick={filtersHandlers.open} className="w-full bg-[#3F3A42] py-2">فیلترها</Button>

      <Modal isShow={isFilters} onClose={filtersHandlers.close} effect="bottom-to-top">
        <Modal.Content
          onClose={filtersHandlers.close}
          className="flex h-full overflow-y-auto flex-col gap-y-5 bg-white px-5 py-3 md:rounded-lg"
        >
          <Modal.Header onClose={filtersHandlers.close}>فیلترها</Modal.Header>
          <Modal.Body>
          <ProductSort />
            <ProductFilterControls
              mainMinPrice={mainMinPrice}
              mainMaxPrice={mainMaxPrice}
              onClose={filtersHandlers.close}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default FilterModal
