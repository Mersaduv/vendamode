import { Header, Footer } from '@/components/shared'

interface Props {
  children: React.ReactNode
  isAccount?: boolean
}

const ClientLayout: React.FC<Props> = ({ children, isAccount }) => {
  return (
    <>
      <Header />
      <main className=''>
      {children}
      </main>
      {!isAccount && <Footer />}
    </>
  )
}

export default ClientLayout
