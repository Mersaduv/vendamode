import { IProductForm } from '@/types'
import dynamic from 'next/dynamic'
import { Control, Controller, UseFormRegister } from 'react-hook-form'
import 'react-quill/dist/quill.snow.css' // Import the styles

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface Props {
  control: Control<IProductForm>
}
const TextEditor: React.FC<Props> = ({ control }) => {
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  }

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ]
  const stripTags = (input: any) => {
    const doc = new DOMParser().parseFromString(input, 'text/html')
    return doc.body.textContent || ''
  }
  return (
    <div>
      <Controller
        name="Description"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <ReactQuill
            {...field}
            theme="snow"
            modules={modules}
            formats={formats}
            onChange={(content, delta, source, editor) => {
              field.onChange(content)
            }}
          />
        )}
      />{' '}
    </div>
  )
}

export default TextEditor
