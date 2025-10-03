import Image from 'next/image'
import { getFAQs } from '@/lib/main/fetchFAQ'
import { getMemberships } from '@/lib/main/fetchMemberships'
import FAQ from '@/components/FAQ'
import Button from '@/components/ui/Button'
import Dog4 from '../public/dog4.png'
import Cat2 from '../public/cat2.png'
import Dog2 from '../public/god2.png'
import Cat1 from '../public/cat1.png'
import Dog3 from '../public/dog3.png'
import Brelok from '../public/brelok.png'
import MediaSlider from '@/components/MediaSlider'
import PricingCard from '@/components/PricingCard'

export default async function Home() {
  const [faqs, memberships] = await Promise.all([getFAQs(), getMemberships()])

  return (
    <div className="mx-auto flex flex-col items-center justify-center space-y-24 overflow-x-hidden">
      <div
        id="main"
        className="bg-gray relative flex w-full flex-col items-center overflow-hidden rounded-b-[100px] md:h-[80vh]"
      >
        <h1 className="sr-only hidden">ZOOPOLIS</h1>

        {/* десктоп и таблет версия */}
        <div className="relative hidden w-full pt-10 sm:block">
          <Image src="/Blur.png" alt="logo" width={1440} height={251} className="w-full" priority />
          <div className="mt-12 flex justify-center px-6 md:px-10 lg:px-30">
            <div className="flex -translate-y-1/2 flex-row items-center justify-between gap-10 md:gap-20">
              <div className="flex max-w-xl flex-col gap-4">
                <div className="space-y-1">
                  <h2 className="text-4xl font-semibold text-gray-900">QR-кулон</h2>
                  <h2 className="text-4xl font-semibold text-gray-900">для питомца</h2>
                </div>
                <p className="text-lg text-gray-600">
                  Просто прикрепите QR-кулон к ошейнику — и любой, кто найдёт вашего питомца, сможет
                  связаться с нашей службой поддержки, которая решит все нюансы по возвращению
                  питомца хозяину.
                </p>
                <a
                  href="https://account.zoopolis.org/login"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    text="Заказать"
                    className="bg-orange hover:bg-orange/90 w-fit px-8 py-3 text-lg font-medium text-white transition-all"
                  />
                </a>
              </div>
              <div className="relative mx-10 flex-shrink-0">
                <Image
                  src="/dog1.svg"
                  alt="Счастливая собака"
                  width={580}
                  height={710}
                  className="relative z-10"
                />
                <div className="bg-orange/10 absolute top-1/2 -right-10 z-0 -translate-y-1/2 rounded-full blur-3xl" />
              </div>
              <div className="flex max-w-md flex-col gap-6">
                <div className="space-y-1">
                  <h2 className="text-4xl font-semibold text-gray-900">QR-кулон Zoopolis</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-gray-600">
                    Защита питомца 24/7. Прочный водонепроницаемый кулон с круглосуточной поддержкой
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* мобилка */}
        <div className="relative flex w-full flex-col sm:hidden">
          <div className="space-y-2 p-4">
            <p className="text-4xl font-semibold text-gray-900">QR-КУЛОН</p>
            <p className="text-3xl font-semibold text-gray-900">ДЛЯ ПИТОМЦА</p>

            <p className="text-base text-gray-600">
              Просто прикрепите QR-кулон к ошейнику — и любой, кто найдёт вашего питомца, сможет
              связаться с нашей службой поддержки, которая решит все нюансы по возвращению питомца
              хозяину.
            </p>
            <a
              href="https://account.zoopolis.org/login"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block"
            >
              <Button
                text="Заказать"
                className="bg-orange hover:bg-orange/90 w-full px-6 py-3 text-base font-medium text-white transition-all"
              />
            </a>
          </div>
          <Image src="/Blur.png" alt="logo" width={1440} height={251} className="w-full" priority />
          <div className="flex flex-col items-center px-6">
            <div className="relative mt-8 w-full max-w-[280px]">
              <Image
                src="/dog1.svg"
                alt="Счастливая собака"
                width={280}
                height={342}
                className="relative z-10 w-full"
              />
              <div className="bg-orange/10 absolute top-1/2 left-1/2 z-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
            </div>
          </div>
        </div>

        {/* блюр снизу */}
        <div className="absolute inset-x-0 -bottom-5 h-40 bg-gradient-to-t from-[#EBEBEB] from-10% via-[#EBEBEB]/80 via-30% to-transparent to-100% blur-md" />
      </div>

      <div className="my-4 flex max-w-[1216px] flex-col items-center justify-center gap-6 px-4 sm:my-6 sm:px-8 lg:my-8 lg:flex-row lg:gap-10 lg:px-0">
        <Image
          src={Dog2}
          alt="dog"
          width={289}
          height={263}
          className="h-auto w-full sm:w-[220px] lg:w-[289px]"
        />
        <div className="flex max-w-sm flex-col items-center justify-center space-y-4 lg:max-w-none lg:space-y-5">
          <h2 className="text-center text-white">
            <span className="text-2xl text-black sm:text-3xl lg:text-4xl">ВАШ ПИТОМЕЦ</span>
            <span className="relative mx-2 inline-block px-1">
              <span className="bg-orange absolute -inset-1 rotate-3 rounded-3xl" />
              <span className="relative text-2xl text-white sm:text-3xl lg:text-4xl">
                ПОТЕРЯЛСЯ
              </span>
            </span>
            <br />
            <span className="mt-2 flex items-center justify-center text-2xl text-black sm:text-3xl lg:text-4xl">
              ЧТО ДАЛЬШЕ?
            </span>
          </h2>
          <div className="px-4 text-center text-sm text-black sm:px-8 sm:text-base lg:px-0 lg:text-lg">
            Бумажные жетоны теряются, информация устаревает. Номер на ошейнике не всегда виден или
            может быть неактуален. Ценные минуты тратятся впустую.
          </div>
        </div>
        <Image
          src={Cat1}
          alt="cat"
          width={289}
          height={263}
          className="h-auto w-full sm:block sm:w-[220px] lg:w-[289px]"
        />
      </div>

      <div
        id="reviews"
        className="container mx-auto max-w-[1216px] px-4 py-4 sm:py-6 md:py-8 lg:py-10"
      >
        <div className="relative grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-12">
          {/* плашка отзывов */}
          <div className="bg-gray/80 absolute top-1/2 left-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-[52px] px-6 py-3 shadow-lg backdrop-blur-sm sm:w-auto sm:px-8 sm:py-4 lg:px-10">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="./reviewIcon.svg"
                alt="star"
                width={140}
                height={24}
                className="h-auto w-[100px] sm:w-[100px] lg:w-[140px]"
              />
              <span className="text-sm sm:text-base">Средняя оценка</span>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8 md:space-y-11">
            <h2 className="text-2xl leading-tight font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Мы создали QR решения, которые помогают питомцам вернутся домой, а их хозяевам -
              оставаться спокойными.
            </h2>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src={Dog3}
                alt="dog"
                width={598}
                height={480}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src={Brelok}
                alt="cat"
                width={400}
                height={330}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-base sm:text-lg">
                С 2020 года создаём QR-кулон для наших мохнатых друзей. Наша команда — ветеринары,
                разработчики и просто любители питомцев, понимающие, как важно быстро получить
                помощь в критический момент.
              </p>
              <p className="text-base sm:text-lg">
                Все данные защищены: серверы, шифрование и строгая конфиденциальность. Доступ к
                информации — только у тех, кому вы его открыли.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="pricing" className="flex max-w-[1216px] flex-col items-center justify-center px-4">
        <h2 className="space-x-4 text-white">
          <span className="text-black">УДОБНАЯ</span>
          <span className="relative mx-2 inline-block px-1">
            <span className="bg-orange absolute -inset-1 rotate-3 rounded-3xl" />
            <span className="relative text-white">ПОДПИСКА</span>
          </span>
          <span className="text-black">ZOOPOLIS</span>
        </h2>
        <div className="mt-5 mb-8 max-w-[600px] text-center">
          Подписка оформляется 1 раз, а списание происходит ежемесячно, условия подписки можно
          регулировать в личном кабинете
        </div>
        <PricingCard memberships={memberships} />
      </div>

      <div
        id="about-us"
        className="my-8 flex max-w-[1216px] flex-col items-center justify-center gap-10"
      >
        <h2 className="text-white">
          <span className="text-black">МЫ НА</span>
          <span className="relative mx-2 inline-block px-1">
            <span className="bg-orange absolute -inset-1 rotate-3 rounded-3xl" />
            <span className="relative text-white">МЕРОПРИЯТИЯХ</span>
          </span>
        </h2>
        <MediaSlider />
      </div>

      <div id="faq">
        <FAQ faqs={faqs} />
      </div>

      <div className="my-4 flex max-w-[1216px] flex-col items-center justify-center gap-4 px-4 sm:my-6 sm:flex-row sm:gap-6 lg:my-8 lg:gap-10">
        <Image
          src={Dog4}
          alt="dog"
          width={289}
          height={263}
          className="h-auto w-full sm:w-[220px] lg:w-[289px]"
        />
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 lg:space-y-5">
          <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl">
            <span className="text-black">Не ждите беды.</span>
            <span className="relative mx-2 inline-block px-1">
              <span className="bg-orange absolute -inset-1 rotate-3 rounded-3xl" />
              <span className="relative text-white">Защитите</span>
            </span>
            <span className="text-black">того</span>
            <br />
            <span className="text-black">кто вас любит, прямо сейчас</span>
          </h2>
          <div className="px-4 text-center text-sm text-black sm:px-8 sm:text-base lg:px-0 lg:text-lg">
            3 месяца Зоо ID-подписки в подарок при покупке QR-кулона!
          </div>
          <a href="https://account.zoopolis.org/login" target="_blank" rel="noopener noreferrer">
            <Button text="Защитить питомца" className="bg-orange text-white" />
          </a>
        </div>
        <Image
          src={Cat2}
          alt="cat"
          width={289}
          height={263}
          className="h-auto w-full sm:w-[220px] lg:w-[289px]"
        />
      </div>
    </div>
  )
}
