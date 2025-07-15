import Image from "next/image"
import { getFAQs } from "@/lib/main/fetchFAQ"
import FAQ from "@/components/FAQ"
import Button from "@/components/ui/Button"
import Dog4 from '../public/dog4.png'
import Cat2 from '../public/cat2.png'
import Dog2 from '../public/god2.png'
import Cat1 from '../public/cat1.png'
import MediaSlider from "@/components/MediaSlider"

export default async function Home() {
const faqs = await getFAQs()

  return (
    <div className="mx-auto flex max-w-[1216px] flex-col items-center justify-center">

     <div className="flex justify-center items-center gap-10 my-8">
        <Image src={Dog2} alt="dog" width={289} height={263} />
        <div className="flex flex-col justify-center items-center space-y-5">
        <h2 className="text-white">
          <span className="text-black">ВАШ ПИТОМЕЦ</span>
          <span className="relative inline-block px-1 mx-2">
            <span className="absolute bg-orange rotate-3 rounded-3xl -inset-1" />
            <span className="relative text-white">ПОТЕРЯЛСЯ</span>
          </span>
          
          <br />
          <span className="text-black flex items-center justify-center mt-2">ЧТО ДАЛЬШЕ?</span>
        </h2>
        <div className="text-black text-center">Бумажные жетоны теряются, информация устаревает. Номер на ошейнике не всегда виден или может быть неактуален. 
        Ценные минуты тратятся впустую.</div>
      
        </div>
        <Image src={Cat1} alt="cat" width={289} height={263} />
      </div>

      <div className="flex flex-col justify-center items-center gap-10 my-8">
        <h2 className="text-white">
          <span className="text-black">МЫ НА</span>
          <span className="relative inline-block px-1 mx-2">
            <span className="absolute bg-orange rotate-3 rounded-3xl -inset-1" />
            <span className="relative text-white">МЕРОПРИЯТИЯХ</span>
          </span>
        </h2>
        <MediaSlider />
      </div>

      <FAQ faqs={faqs} />

      <div className="flex justify-center items-center gap-10 my-8">
        <Image src={Dog4} alt="dog" width={289} height={263} />
        <div className="flex flex-col justify-center items-center space-y-5">
        <h2 className="text-white">
          <span className="text-black">Не ждите беды.</span>
          <span className="relative inline-block px-1 mx-2">
            <span className="absolute bg-orange rotate-3 rounded-3xl -inset-1" />
            <span className="relative text-white">Защитите</span>
          </span>
          <span className="text-black">того</span>
          <br />
          <span className="text-black">кто вас любит, прямо сейчас</span>
        </h2>
        <div className="text-black text-center">3 месяца Зоо ID-подписки в подарок при покупке QR-кулона!</div>
        <Button text="Защитить питомца" className="bg-orange text-white" />
        </div>
        <Image src={Cat2} alt="cat" width={289} height={263} />
      </div>
    </div>
  )
}
