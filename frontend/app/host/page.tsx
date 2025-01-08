import React from 'react'

import Properties from './addProperty/page'

type Props = {}

const page = (props: Props) => {
  return (<>

    <Properties/>
    <footer className='flex justify-center items-center'><p >copyrights 2024</p></footer>
  </>
  )
}

export default page