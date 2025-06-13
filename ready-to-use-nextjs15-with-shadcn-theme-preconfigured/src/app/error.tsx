"use client"; // Error components must be Client Components

// import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }: any) {
  const router = useRouter();
  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   console.error("Error Caught", error)
  // }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => {
            // reset() // agr reset krna hai to ye run krdo is error page ko reset krde ga
            return router.back(); //lkn me aik page pechy krra hon jo ke correct page tha.
          }
        }
      >
        Try again
      </button>
    </div>
  );
}
