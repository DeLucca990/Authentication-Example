import { prisma } from '@/lib/prisma'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Page({user}: Props) {
  return <main>Hello, {user?.name}</main>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await prisma.user.findFirst({
    where: {
      email: 'test@test.com'
    }
  })

  return {
    props: {
      user
    }
  }
}