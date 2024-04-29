import React from 'react'

interface Props {
    errors : string[]
}
export default function ValidationErrors({errors} :Props) {
  return (
    <>
      {errors && (
        <ul className='p-2 bg-red-400 text-red font-bold-800 text-sm rounded-md'>
            {errors.map((err:string, i) =>(
                <li key={i}>{err}</li>
            ))}
        </ul>
      )}
    </>
  );
}
