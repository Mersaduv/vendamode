import { useEffect, useState } from 'react'

import { useGetCategoriesQuery, useGetCategoriesTreeQuery } from '@/services'

import { SelectBox } from '@/components/ui'

import type { ICategory, IProductForm } from '@/types'
import { SelectedCategories } from '../form/ProductForm'
import { UseFormRegister } from 'react-hook-form'

interface Props {
  selectedCategories: SelectedCategories
  setSelectedCategories: React.Dispatch<React.SetStateAction<SelectedCategories>>
  categories: ICategory[]
}

interface Prop {
  categories: ICategory[]
  selectedCategories: SelectedCategories
  setSelectedCategories: React.Dispatch<React.SetStateAction<SelectedCategories>>
}

const CategorySelector: React.FC<Props> = (props) => {
  const { selectedCategories, setSelectedCategories, categories } = props

  const CategoryTree: React.FC<Prop> = (prop) => {
    const { categories, selectedCategories, setSelectedCategories } = prop

    const handleCheckboxChange = (category: ICategory) => {
      setSelectedCategories((prevState) => ({
        ...prevState,
        categorySelected: category,
      }))
    }

    const hasSelectedChild = (category: ICategory) : boolean => {
      if (category.childCategories) {
        return category.childCategories.some(
          (childCategory) =>
            selectedCategories.categorySelected?.id === childCategory.id || hasSelectedChild(childCategory)
        )
      }
      return false
    }

    return (
      <ul className="space-y-1">
        {categories.map((category) => (
          <li key={category.id} className={` space-y-1.5  ${category.level > 1 ? ' mr-5' : ''}`}>
            <label className="flex items-center whitespace-nowrap cursor-pointer">
              <input
                className={`checked:text-2xl cursor-pointer pt-1 ${
                  category.childCategories && category.childCategories.length > 0
                    ? hasSelectedChild(category)
                      ? 'bg-blue-400'
                      : 'disabled'
                    : ''
                } ${
                  category.childCategories && category.childCategories.length > 0
                    ? 'bg-[#f7f8fa] border-none rounded-md w-[24px] h-[24px] ml-2'
                    : 'border-none rounded-md w-[24px] h-[24px] ml-2 bg-[#eff2f5]'
                }`}
                type="checkbox"
                checked={selectedCategories.categorySelected?.id === category.id}
                onChange={() => handleCheckboxChange(category)}
                disabled={category.childCategories && category.childCategories.length > 0}
              />
              {category.name}
            </label>
            {category.childCategories && (
              <CategoryTree
                categories={category.childCategories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                
              />
            )}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="w-full mt-3  overflow-auto">
      {categories && (
        <CategoryTree
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          categories={categories}
          
        />
      )}
    </div>
  )
}

export default CategorySelector

// interface Props {
//   selectedCategories: SelectedCategories
//   setSelectedCategories: React.Dispatch<React.SetStateAction<SelectedCategories>>
//   categories: ICategory[]
// }

// interface Prop {
//   categories: ICategory[]
//   selectedCategories: SelectedCategories
//   setSelectedCategories: React.Dispatch<React.SetStateAction<SelectedCategories>>
// }

// const CategorySelector: React.FC<Props> = (props) => {
//   const { selectedCategories, setSelectedCategories, categories } = props;

//   const CategoryTree: React.FC<Prop> = (prop) => {
//     const { categories, selectedCategories, setSelectedCategories } = prop;

//     const handleCheckboxChange = (category: ICategory) => {
//       setSelectedCategories((prevState) => ({
//         ...prevState,
//         categorySelected: category,
//       }));
//     };

//     const hasSelectedChild = (category: ICategory) => {
//       if (category.childCategories) {
//         return category.childCategories.some(
//           (childCategory) =>
//             selectedCategories.categorySelected?.id === childCategory.id ||
//             hasSelectedChild(childCategory)
//         );
//       }
//       return false;
//     };

//     return (
//       <ul className="space-y-1 ml-4">
//         {categories.map((category) => (
//           <li key={category.id} className="space-y-1">
//             <label className="flex items-center">
//               <input
//                 className={`mr-2 ${
//                   category.childCategories && category.childCategories.length > 0
//                     ? hasSelectedChild(category)
//                       ? "bg-blue-100"
//                       : "disabled"
//                     : "mr-4"
//                 } ${
//                   category.childCategories && category.childCategories.length > 0
//                     ? "bg-[#f7f8fa] border-none rounded-md w-[23px] h-[23px] ml-2"
//                     : "border-none rounded-md w-[23px] h-[23px] ml-2 bg-[#eff2f5]"
//                 }`}
//                 type="checkbox"
//                 checked={selectedCategories.categorySelected?.id === category.id}
//                 onChange={() => handleCheckboxChange(category)}
//                 disabled={category.childCategories && category.childCategories.length > 0}
//               />
//               {category.name}
//             </label>
//             {category.childCategories && category.childCategories.length > 0 && (
//               <CategoryTree
//                 categories={category.childCategories}
//                 selectedCategories={selectedCategories}
//                 setSelectedCategories={setSelectedCategories}
//               />
//             )}
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   return (
//     <div className="w-full gap-y-6">
//       {categories && (
//         <CategoryTree
//           selectedCategories={selectedCategories}
//           setSelectedCategories={setSelectedCategories}
//           categories={categories}
//         />
//       )}
//     </div>
//   );
// };

// export default CategorySelector;