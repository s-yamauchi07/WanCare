import Image from "next/image";
import Link from "next/link";
import dog_registration from "@/public/dog_registration.png";
import IconButton from "@/app/_components/IconButton";

const addDog: React.FC = () => {
  return(
    <div className="flex justify-center">
      <div className="w-64 my-20 flex flex-col items-center">
        <Image 
          src={dog_registration}
          alt="dog_img"
          width={200}
          priority={true}
        />
        <p className="text-xl mb-4">
          ペットを登録しましょう
        </p>
        <Link href="/dogs/form">
          <IconButton 
            iconName="i-material-symbols-add-rounded"
            buttonText="ペットを登録する"
          />
        </Link>
      </div>
    </div>
  )
}

export default addDog;
