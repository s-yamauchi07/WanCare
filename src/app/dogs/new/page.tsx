import Image from "next/image";
import Link from "next/link";
import dog_registration from "@/public/dog_registration.png";


const addDog: React.FC = () => {
  return(
    <div className="w-80 flex flex-col items-center pt-20">
      <Image 
        src={dog_registration}
        alt="dog_img"
        width={200}
        priority={true}
      />
      <p className="text-xl">
        ペットを登録しましょう
      </p>
      <Link 
        href="/dogs/form"
        className="bg-primary hover:bg-emerald-500 text-white font-bold py-2 px-4 mt-4 rounded-full focus:outline-none focus:shadow-outline flex items-center"
      >
        <span className="i-material-symbols-add-rounded mr-1"></span>
        <span>ペットを登録する</span>
      </Link>
    </div>
  )
}

export default addDog;
