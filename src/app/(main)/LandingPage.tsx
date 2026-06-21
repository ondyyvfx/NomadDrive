'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

/* ─── Translations ─── */
const T = {
    ru: {
        hero_eyebrow: 'Аренда · Покупка · Продажа · Запчасти',
        hero_title_1: 'Дороги не кончаются.',
        hero_title_em: 'И ты',
        hero_title_2: 'тоже.',
        hero_sub: 'Найди авто за 30 секунд, выставь своё за 2 минуты или закажи нужную запчасть — всё на одной платформе. Каждый километр — твой.',
        search_city: 'Город',
        search_city_any: 'Любой город',
        search_brand: 'Марка',
        search_brand_any: 'Любая марка',
        search_fuel: 'Тип топлива',
        search_fuel_any: 'Любой',
        search_fuel_petrol: 'Бензин',
        search_fuel_diesel: 'Дизель',
        search_fuel_electric: 'Электро',
        search_fuel_hybrid: 'Гибрид',
        search_price: 'Цена / сутки',
        search_price_any: 'Любая',
        search_price_1: 'до 30 000 ₸',
        search_price_2: 'до 50 000 ₸',
        search_price_3: 'до 80 000 ₸',
        search_price_4: 'от 80 000 ₸',
        search_cta: 'Найти авто',
        search_reset: 'Сбросить',
        stat_1_n: '8 400+',
        stat_1_l: 'Водителей в месяц',
        stat_2_n: '14 городов',
        stat_2_l: 'Доставка до двери',
        stat_3_n: '4.9 / 5',
        stat_3_l: 'Средняя оценка',
        ticker_items: ['Аренда от 18 000₸/день', '14 городов', 'Доставка до двери', '8 400+ водителей', 'Запчасти за 24ч', 'Проверенные авто', 'Гарантированный выкуп'],
        mode_rent: 'Аренда',
        mode_buy: 'Покупка',
        mode_sell: 'Продажа',
        mode_parts: 'Запчасти',
        mode_badge_rent: 'сутки',
        mode_badge_buy: '4.2k',
        mode_badge_sell: '7 дней',
        mode_badge_parts: 'OEM',
        title_rent: ['Топ выбор — то, что ', 'берут первым'],
        title_buy: ['Авто готовы к ', 'смене хозяина'],
        title_sell: ['Продай своё — ', 'мы берём всё на себя'],
        title_parts: ['Запчасти, которые будут ', 'завтра'],
        sub_rent: 'Популярные автомобили среди наших клиентов — проверены на комфорт, надёжность и стиль, который оправдывает аренду.',
        sub_buy: 'Проверены сертифицированными механиками с полной историей владения и 7-дневным возвратом. Без театра автосалона.',
        sub_sell: 'Загрузите VIN и четыре фото. Мы приедем в течение 24 часов, оценим по рынку и выплатим в течение 7–14 дней.',
        sub_parts: 'OEM-новые, сертифицированные б/у или восстановленные — все маркированные, все с гарантией, все на нашем складе.',
        btn_rent: 'Смотреть весь каталог',
        btn_buy: 'Смотреть маркетплейс',
        btn_sell: 'Получить оценку',
        btn_parts: 'Каталог запчастей',
        sell_eyebrow: '4-шаговая продажа',
        sell_title_1: 'Выстави авто',
        sell_title_em: 'за 4 минуты',
        sell_sub: 'Забудь про сайты объявлений и вежливый торг ниже рынка. Мы инспектируем, оцениваем, публикуем для проверенных покупателей и выплачиваем наличными или переводом в течение двух недель.',
        sell_cta: 'Начать бесплатно',
        sell_steps: [
            { label: 'VIN', body: 'Введите VIN — мы автоматически получим комплектацию, опции и историю владения.' },
            { label: 'Фото', body: 'Четыре снаружи, два внутри, одно приборной панели. Камера телефона подойдёт.' },
            { label: 'Оценка', body: 'В течение 24ч: инспектор приезжает к вам, вы получаете гарантированную цену выкупа.' },
            { label: 'Выплата', body: 'Выберите выкуп или маркетплейс. В любом случае документы — на нас.' },
        ],
        showcase_eyebrow: 'О NomadDrive',
        showcase_title_1: 'Гараж',
        showcase_title_2: 'без',
        showcase_title_em: 'стен',
        showcase_p1: 'Мы создали NomadDrive, потому что рынок аренды и подержанных авто относится к водителям как к логистической задаче. Долгие стойки, скрытые платежи, фото не совпадают с машиной, каталоги запчастей с вечным "нет в наличии".',
        showcase_p2: 'Мы перестроили все четыре процесса — аренда, покупка, продажа, запчасти — вокруг одного обещания: каждый автомобиль, каждая запчасть, каждая передача — сначала проверены человеком.',
        showcase_chip1: 'Ежедневный комфорт',
        showcase_chip1s: 'Салон для долгой дороги домой',
        showcase_chip2: 'Безопасность',
        showcase_chip2s: 'Полная проверка при каждой передаче',
        showcase_chip3: 'Стиль говорит',
        showcase_chip3s: 'прежде чем ты',
        showcase_btn: 'Читать манифест',
        why_eyebrow: 'Почему остаются',
        why_title_1: 'Тысячи водителей',
        why_title_em: 'каждый месяц',
        why_title_2: '. Вот почему.',
        why_sub: 'Шесть простых обязательств, которые вместе становятся причиной, по которой перестают искать другие варианты.',
        why_1_title: ['', 'Механически', ' надёжно, всегда'],
        why_1_body: 'Каждый автомобиль выходит из мастерской, а не с парковки. Регулярное ТО, чистый салон, готовые к дороге шины при каждой передаче.',
        why_2_title: ['', 'Широкий выбор', ' премиум-классов'],
        why_2_body: 'Mercedes-Benz, BMW, Porsche, Bentley. Купе, спорт, седаны, внедорожники, кабриолеты — созданы для поездки, не для объявления.',
        why_3_title: ['', 'Прозрачные', ' цены'],
        why_3_body: 'Без скрытого пробега, топливных театров, «надбавки за локацию». Одна цена, всё включено, возврат до 24ч до выдачи.',
        why_4_title: ['', 'Гибкие', ' условия аренды'],
        why_4_body: 'Часы, дни, недели или месяцы. Вариант с залогом или без. Бесплатная отмена до 24ч до выдачи, смена класса в процессе.',
        why_5_title: ['', 'Доставка', ' до двери'],
        why_5_body: 'На любой адрес в 14 городах — дом, отель, аэропорт, офис. Бесплатно в пределах 25 км от хаба NomadDrive.',
        why_6_title: ['', 'Страховка', ' включена'],
        why_6_body: 'Комплексное покрытие включено в суточную ставку — ОСАГО, угон, пожар, ДТП. Один номер для звонка при любом случае.',
        why_foot: ['Мы создали сервис, где каждая деталь работает в вашу пользу — комфорт, уверенность и тихое ощущение, что ключи, которые вы держите, ', 'ждали именно вас', '.'],
        steps_eyebrow: 'Как это работает',
        steps_title_1: 'Арендуй авто',
        steps_title_em: 'за три',
        steps_title_2: 'шага',
        steps_sub: 'От первого клика до запуска двигателя: минимум усилий, максимум уверенности. Три шага, никаких очередей и бумаг.',
        steps_cta: 'Забронировать авто',
        steps: [
            { t1: 'Выбери ', em: 'свой', t2: ' маршрут', body: 'Фильтруй по городу, датам, классу, трансмиссии или цене. Сохрани до пяти поисков, получай уведомления о редких классах.' },
            { t1: 'Войди за ', em: '60 секунд', t2: '', body: 'Подтверди права и удостоверение один раз. Мы шифруем данные, никому не передаём. Все следующие бронирования — один тап.' },
            { t1: 'Выезжай на ', em: 'дорогу', t2: '', body: 'Видеообход при передаче, полный бак, сохранённые настройки сиденья и зеркал. Сдай авто где угодно — мы заберём.' },
        ],
        testi_title_1: 'Реальные отзывы',
        testi_title_em: 'реальных',
        testi_title_2: ' водителей',
        testimonials: [
            {
                name: 'Айгерім Бекова',
                stars: 5,
                text: 'Арендовала Defender на выходные в горах — доставили к отелю в 8 утра, ключи передали без бумаг. Горный режим и пыль на ветровом стекле к закату — единственные признаки, что он был.',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
            },
            {
                name: 'Нұрлан Жақсыбеков',
                stars: 5,
                text: 'Продал свою машину через NomadDrive за 11 дней. Оценка оказалась в пределах 250 000₸ от того, что мне назвал независимый специалист. Документы и транспортировку взяли на себя. Редко чувствовал себя так по-человечески.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                featured: true,
            },
            {
                name: 'Дана Сейткалі',
                stars: 5,
                text: 'Нужна была фара для RS5 2019 года — три местных магазина говорили шесть недель. NomadDrive Parts привезли к двери за 48 часов с кронштейном и проводкой в коробке. Теперь мой выбор по умолчанию.',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
            },
        ],
        faq: [
            {
                q: 'Какие документы нужны для аренды?',
                a: ['Удостоверение личности или паспорт', 'Действующее водительское удостоверение (стаж от 2 лет)', 'Карта для блокировки залога', 'Справка с места работы для корпоративного аккаунта'],
            },
            {
                q: 'Есть ли возрастное ограничение?',
                a: ['Водители от 23 до 70 лет с двухлетним стажем. Небольшая надбавка за молодого водителя применяется для возраста 21–22 лет на стандартных классах.'],
            },
            {
                q: 'Как продать авто через NomadDrive?',
                a: ['Загрузите VIN и несколько фото. В течение 24ч мы пришлём проверенного инспектора, дадим гарантированную цену выкупа и цену листинга, возьмём на себя документы, транспортировку и выплату в течение 7–14 дней.'],
            },
            {
                q: 'Запчасти новые, б/у или восстановленные?',
                a: ['Каждый лот маркирован: OEM-новый, сертифицированный б/у или восстановленный партнёрской мастерской. Все запчасти поставляются с гарантией 12 месяцев и бесплатным возвратом в течение 14 дней.'],
            },
            {
                q: 'Доставляете ли вы авто на любой адрес?',
                a: ['Да — домой, в аэропорт, отель или офис в любом из 14 городов. Бесплатно в пределах 25 км от хаба NomadDrive; фиксированная ставка за километр сверх этого.'],
            },
        ],
        cta_eyebrow: 'Свяжитесь с нами',
        cta_title_1: 'Готовы ехать',
        cta_title_em: 'без бумажной',
        cta_title_2: 'волокиты?',
        cta_sub: 'Расскажите когда, куда и на чём хотите ехать. Живой человек ответит в течение часа в рабочее время с предложением и тремя вариантами.',
        cta_name: 'Имя',
        cta_phone: 'Номер телефона',
        cta_email: 'Email',
        cta_send: 'Отправить',
        cta_sent: 'Отправлено — скоро свяжемся',
        footer_c1: 'Комфорт в',
        footer_c1a: 'каждой поездке',
        footer_c2: 'Безопасность',
        footer_c2a: 'с первого ключа',
        footer_c3: 'Выбрано',
        footer_c3a: 'водителями, не алгоритмами',
        footer_copy: '2026 © NomadDrive. Создано для долгой дороги домой.',
        footer_links: [
            { label: 'Каталог', href: '/rent' },
            { label: 'Маркетплейс', href: '/sale' },
            { label: 'Как это работает', href: '#how' },
            { label: 'О нас', href: '#about' },
            { label: 'Контакты', href: '#contact' },
        ],
    },
    kz: {
        hero_eyebrow: 'Жалдау · Сатып алу · Сату · Бөлшектер',
        hero_title_1: 'Жолдар бітпейді.',
        hero_title_em: 'Сен де',
        hero_title_2: 'бітпейсің.',
        hero_sub: '30 секундта автокөлік тап, 2 минутта өзіңкіні сат немесе қажетті бөлшекке тапсырыс бер — бәрі бір платформада. Әр шақырым — сеніңкі.',
        search_city: 'Қала',
        search_city_any: 'Кез келген қала',
        search_brand: 'Маркасы',
        search_brand_any: 'Кез келген марка',
        search_fuel: 'Отын түрі',
        search_fuel_any: 'Кез келген',
        search_fuel_petrol: 'Бензин',
        search_fuel_diesel: 'Дизель',
        search_fuel_electric: 'Электро',
        search_fuel_hybrid: 'Гибрид',
        search_price: 'Бағасы / тәулік',
        search_price_any: 'Кез келген',
        search_price_1: '30 000 ₸ дейін',
        search_price_2: '50 000 ₸ дейін',
        search_price_3: '80 000 ₸ дейін',
        search_price_4: '80 000 ₸ бастап',
        search_cta: 'Автокөлік тап',
        search_reset: 'Тазалау',
        stat_1_n: '8 400+',
        stat_1_l: 'Айына жүргізуші',
        stat_2_n: '14 қала',
        stat_2_l: 'Есікке жеткізу',
        stat_3_n: '4.9 / 5',
        stat_3_l: 'Орташа баға',
        ticker_items: ['Жалдау 18 000₸/күннен', '14 қала', 'Есікке жеткізу', '8 400+ жүргізуші', 'Бөлшек 24 сағатта', 'Тексерілген автокөлік', 'Кепілді сатып алу'],
        mode_rent: 'Жалдау',
        mode_buy: 'Сатып алу',
        mode_sell: 'Сату',
        mode_parts: 'Бөлшектер',
        mode_badge_rent: 'тәулік',
        mode_badge_buy: '4.2k',
        mode_badge_sell: '7 күн',
        mode_badge_parts: 'OEM',
        title_rent: ['Үздік таңдау — алдымен ', 'алатындар'],
        title_buy: ['Автокөліктер жаңа ', 'иеге дайын'],
        title_sell: ['Өзіңкіні сат — ', 'қалғанын біз жасаймыз'],
        title_parts: ['Ертең келетін ', 'бөлшектер'],
        sub_rent: 'Клиенттер арасында танымал автокөліктер — жайлылық, сенімділік және аренданы ақтайтын стиль тексерілген.',
        sub_buy: 'Толық иелік тарихымен сертификатталған механиктер тексерген, 7 күндік қайтару мүмкіндігімен. Автосалон театрынсыз.',
        sub_sell: 'VIN мен төрт фото жүктеңіз. 24 сағат ішінде барамыз, нарық бойынша бағалаймыз және 7–14 күнде төлейміз.',
        sub_parts: 'OEM-жаңа, сертификатталған б/у немесе қалпына келтірілген — барлығы таңбаланған, барлығы кепілдікпен, барлығы қоймада.',
        btn_rent: 'Барлық каталогты қарау',
        btn_buy: 'Маркетплейсті қарау',
        btn_sell: 'Баға алу',
        btn_parts: 'Бөлшектер каталогы',
        sell_eyebrow: '4 қадамды сату',
        sell_title_1: 'Автокөлікті',
        sell_title_em: '4 минутта сат',
        sell_sub: 'Хабарландыру сайттары мен сыпайы кем бағалаулары ұмыт. Біз тексереміз, бағалаймыз, тексерілген сатып алушыларға жариялаймыз және екі апта ішінде қолма-қол немесе аударыммен төлейміз.',
        sell_cta: 'Тегін бастау',
        sell_steps: [
            { label: 'VIN', body: 'VIN енгізіңіз — жинақтауды, опцияларды және иелік тарихын автоматты аламыз.' },
            { label: 'Фото', body: 'Сырттан төрт, іштен екі, приборлар тақтасынан бір. Телефон камерасы жеткілікті.' },
            { label: 'Бағалау', body: '24 сағат ішінде: инспектор келеді, кепілді сатып алу бағасы беріледі.' },
            { label: 'Төлем', body: 'Сатып алуды немесе маркетплейсті таңдаңыз. Кез келген жағдайда құжаттар біздің мойнымызда.' },
        ],
        showcase_eyebrow: 'NomadDrive туралы',
        showcase_title_1: 'Қабырғасыз',
        showcase_title_2: '',
        showcase_title_em: 'гараж',
        showcase_p1: 'Біз NomadDrive-ны жалдау мен б/у автокөлік нарығы жүргізушілерді логистикалық мәселе ретінде қарастыратынына байланысты құрдық. Ұзақ кезектер, жасырын ақылар, суреттер машинамен сәйкес келмеу, тапшы каталогтар.',
        showcase_p2: 'Барлық төрт процесті — жалдау, сатып алу, сату, бөлшектер — бір уәде айналасында қайта құрдық: әр автокөлік, әр бөлшек, әр тапсыру — алдымен адам тексереді.',
        showcase_chip1: 'Күнделікті жайлылық',
        showcase_chip1s: 'Ұзақ жол үшін салон',
        showcase_chip2: 'Қауіпсіздік',
        showcase_chip2s: 'Толық тексеру',
        showcase_chip3: 'Стиль сөйлейді',
        showcase_chip3s: 'сенің алдыңда',
        showcase_btn: 'Манифест оқу',
        why_eyebrow: 'Неге қалады',
        why_title_1: 'Мыңдаған жүргізуші',
        why_title_em: 'әр ай',
        why_title_2: '. Міне, неге.',
        why_sub: 'Басқа нұсқаларды іздеуді тоқтататын алты қарапайым міндеттеме.',
        why_1_title: ['', 'Механикалық', ' жағынан сенімді, әрдайым'],
        why_1_body: 'Әр автокөлік тұрақ емес, шеберханадан шығады. Тұрақты ТО, таза салон, дайын дөңгелектер.',
        why_2_title: ['', 'Кең таңдау', ' премиум кластар'],
        why_2_body: 'Mercedes-Benz, BMW, Porsche, Bentley. Купе, спорт, седан, жол таңдамайтын, кабриолет — жарнама емес, сапар үшін.',
        why_3_title: ['', 'Мөлдір', ' бағалар'],
        why_3_body: 'Жасырын жүріс жоқ, жанармай театры жоқ, «орын қосымшасы» жоқ. Бір баға, бәрі кіреді, тапсырудан 24 сағат бұрын қайтарым.',
        why_4_title: ['', 'Икемді', ' жалдау шарттары'],
        why_4_body: 'Сағат, күн, апта немесе ай. Кепілмен немесе кепілсіз нұсқа. Тапсырудан 24 сағат бұрын тегін бас тарту, процесте класс ауыстыру.',
        why_5_title: ['', 'Есікке', ' жеткізу'],
        why_5_body: '14 қаладағы кез келген мекенжайға — үй, қонақ үй, әуежай, кеңсе. NomadDrive хабынан 25 км шеңберінде тегін.',
        why_6_title: ['', 'Сақтандыру', ' кіреді'],
        why_6_body: 'Кешенді қамтылым тәуліктік бағаға кіреді — ЖТКО, ұрлық, өрт, ДТП. Кез келген жағдайда бір ғана нөмір.',
        why_foot: ['Біз сервис құрдық, онда барлық бөлшек сіздің пайдаңызға жұмыс істейді — жайлылық, сенімділік және ұстаған кілттер ', 'сізді күткендей', ' деген сезім.'],
        steps_eyebrow: 'Қалай жұмыс істейді',
        steps_title_1: 'Автокөлікті',
        steps_title_em: 'үш',
        steps_title_2: 'қадамда жалда',
        steps_sub: 'Бірінші кликтен қозғалтқыш іске қосылғанға дейін: минимум күш, максимум сенімділік. Үш қадам, кезек жоқ, қағаз жоқ.',
        steps_cta: 'Автокөлік брондау',
        steps: [
            { t1: 'Өз ', em: 'бағытыңды', t2: ' таңда', body: 'Қала, күн, класс, трансмиссия немесе баға бойынша сүзіңіз. Бес іздеуді сақтаңыз, сирек кластар туралы хабарлама алыңыз.' },
            { t1: '', em: '60 секундта', t2: ' тіркел', body: 'Куәлік пен жол жүру құқығын бір рет растаңыз. Деректерді шифрлаймыз, бөліспейміз. Кез келген құрылғыдан бір таспен.' },
            { t1: 'Жолға ', em: 'шық', t2: '', body: 'Тапсыруда бейнешолу, толық бак, сақталған орындық пен айна параметрлері. Кез келген жерде тапсыр — біз аламыз.' },
        ],
        testi_title_1: 'Нақты пікірлер',
        testi_title_em: 'нақты',
        testi_title_2: ' жүргізушілерден',
        testimonials: [
            {
                name: 'Айгерім Бекова',
                stars: 5,
                text: 'Таулы демалыс үшін Defender жалдадым — таңертең 8-де қонақ үйге жеткізді, қағазсыз ключ берді. Таулы режим мен кешке ветровой шыныдағы шаң — болғанының жалғыз белгісі.',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
            },
            {
                name: 'Нұрлан Жақсыбеков',
                stars: 5,
                text: 'Автокөлігімді NomadDrive арқылы 11 күнде саттым. Баға тәуелсіз маман айтқаннан 250 000₸ ішінде болды. Құжаттар мен тасымалды өздері алды. Мұндай сыйластық сирек кездеседі.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                featured: true,
            },
            {
                name: 'Дана Сейткалі',
                stars: 5,
                text: '2019 RS5 үшін фара керек болды — үш жергілікті дүкен алты аптаны айтты. NomadDrive Parts 48 сағатта кронштейн мен сыммен бірге жеткізді. Енді бәрі үшін негізгі таңдауым.',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
            },
        ],
        faq: [
            {
                q: 'Жалдау үшін қандай құжаттар керек?',
                a: ['Жеке куәлік немесе паспорт', 'Жарамды жол жүру құқығы (кемінде 2 жыл)', 'Кепілді ұстауға арналған карта', 'Корпоративті аккаунт үшін жұмыс орнынан анықтама'],
            },
            {
                q: 'Жас шегі бар ма?',
                a: ['Екі жылдық тәжірибесі бар 23–70 жас аралығындағы жүргізушілер. 21–22 жастағы жүргізушілерге стандартты кластарда небольшой қосымша ақы алынады.'],
            },
            {
                q: 'NomadDrive арқылы автокөлікті сату қалай жұмыс істейді?',
                a: ['VIN мен бірнеше фото жүктеңіз. 24 сағат ішінде тексерілген инспекторды жібереміз, кепілді сатып алу бағасы мен листинг бағасын береміз, құжаттар, тасымал мен 7–14 күн ішінде төлемді өз мойнымызға аламыз.'],
            },
            {
                q: 'Бөлшектер жаңа, б/у немесе қалпына келтірілген бе?',
                a: ['Әр лот таңбаланған: OEM-жаңа, сертификатталған б/у немесе серіктес шеберхана қалпына келтірген. Барлық бөлшектерге 12 ай кепілдік және 14 күн ішінде тегін қайтарым беріледі.'],
            },
            {
                q: 'Кез келген мекенжайға жеткізесіз бе?',
                a: ['Иә — 14 қаладағы кез келген үйге, әуежайға, қонақ үйге немесе кеңсеге. NomadDrive хабынан 25 км шеңберінде тегін; одан тыс километрге бекітілген тариф.'],
            },
        ],
        cta_eyebrow: 'Бізбен байланысыңыз',
        cta_title_1: 'Қағаз',
        cta_title_em: 'тіркеусіз',
        cta_title_2: ' жүруге дайынсыз ба?',
        cta_sub: 'Қашан, қайда және нені айдағыңыз келетінін айтыңыз. Жұмыс уақытында бір сағат ішінде нақты адам жауап береді.',
        cta_name: 'Аты',
        cta_phone: 'Телефон нөмірі',
        cta_email: 'Email',
        cta_send: 'Жіберу',
        cta_sent: 'Жіберілді — жақын арада хабарласамыз',
        footer_c1: 'Әр сапарда',
        footer_c1a: 'жайлылық',
        footer_c2: 'Бірінші кілттен',
        footer_c2a: 'қауіпсіздік',
        footer_c3: 'Жүргізушілер таңдаған,',
        footer_c3a: 'алгоритм емес',
        footer_copy: '2026 © NomadDrive. Ұзақ жол үшін жасалған.',
        footer_links: [
            { label: 'Каталог', href: '/rent' },
            { label: 'Маркетплейс', href: '/sale' },
            { label: 'Қалай жұмыс істейді', href: '#how' },
            { label: 'Біз туралы', href: '#about' },
            { label: 'Байланыс', href: '#contact' },
        ],
    },
}

/* ─── Типы данных из Supabase ─── */
interface RentCarRow {
    id: string; brand: string; model: string; year: number; seats: number
    transmission: string | null; fuel_type: string | null
    price_per_day: number; image_urls: string[] | null
}
interface SaleCarRow {
    id: string; brand: string; model: string; year: number; mileage: number
    transmission: string | null; fuel_type: string | null
    price: number; image_urls: string[] | null
}
interface PartRow {
    id: string; name: string; brand: string; category: string | null
    price: number; oem_number: string | null; image_urls: string[] | null
}

interface SearchMeta {
    brands: string[]
    cities: string[]
}

interface LandingData {
    rentCars: RentCarRow[]
    saleCars: SaleCarRow[]
    parts: PartRow[]
    searchMeta: SearchMeta
}

const transLabel: Record<string, string> = { auto: 'автомат', manual: 'механика' }
const fuelLabel: Record<string, string> = { petrol: 'бензин', diesel: 'дизель', electric: 'электро', hybrid: 'гибрид' }

/* Нормализованная карточка авто для витрины */
interface VehicleView {
    href: string; brand: string; model: string; img: string | null
    year: number; seats: number; meta: string; price: string; unit: string
}

function rentToView(c: RentCarRow): VehicleView {
    return {
        href: `/rent/${c.id}`, brand: c.brand, model: c.model, img: c.image_urls?.[0] ?? null,
        year: c.year, seats: c.seats,
        meta: [c.transmission && transLabel[c.transmission], c.fuel_type && fuelLabel[c.fuel_type]].filter(Boolean).join(' · '),
        price: c.price_per_day.toLocaleString('ru-RU'), unit: '₸/день',
    }
}
function saleToView(c: SaleCarRow): VehicleView {
    return {
        href: `/sale/${c.id}`, brand: c.brand, model: c.model, img: c.image_urls?.[0] ?? null,
        year: c.year, seats: 0,
        meta: [`${(c.mileage / 1000).toFixed(0)}к км`, c.transmission && transLabel[c.transmission]].filter(Boolean).join(' · '),
        price: c.price.toLocaleString('ru-RU'), unit: '₸',
    }
}

/* ─── SVG icons ─── */
function ArrowIcon({ size = 16 }: { size?: number }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
            <line x1="7" y1="17" x2="17" y2="7" /><polyline points="9 7 17 7 17 15" />
        </svg>
    )
}
function ChevronDownIcon({ size = 14 }: { size?: number }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
            <polyline points="6 9 12 15 18 9" />
        </svg>
    )
}
function SeatIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={12} height={12}>
            <path d="M16 19v-3M8 19v-3M4 21h16M5 16h14a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2zM7 9V5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v4" />
        </svg>
    )
}

/* ─── Sections ─── */
type T = typeof T.ru

/* Опция выпадающего списка */
interface SelectOption { value: string; label: string }

/* Один селект Hero-поиска: кнопка + выпадающая панель с реальными вариантами */
function HeroSelect({
    label, value, options, placeholder, isOpen, onToggle, onSelect,
}: {
    label: string
    value: string
    options: SelectOption[]
    placeholder: string
    isOpen: boolean
    onToggle: () => void
    onSelect: (v: string) => void
}) {
    const current = options.find(o => o.value === value)
    return (
        <div className="relative">
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex flex-col gap-1 rounded-[14px] px-4 py-3.5 text-left transition-colors"
                style={{ background: isOpen ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)' }}
                onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            >
                <span className="text-[10px] uppercase tracking-[0.14em] opacity-60" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
                <span className="flex items-center justify-between gap-2 text-[14px] font-medium text-[#f2ede4]">
                    <span className={current ? '' : 'opacity-55'}>{current ? current.label : placeholder}</span>
                    <span className="opacity-60 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}><ChevronDownIcon /></span>
                </span>
            </button>
            {isOpen && (
                <div
                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-[14px] p-1.5 max-h-[280px] overflow-y-auto"
                    style={{ background: '#15151a', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 24px 50px -12px rgba(0,0,0,0.6)' }}
                >
                    <button
                        type="button"
                        onClick={() => onSelect('')}
                        className="w-full text-left px-3.5 py-2.5 rounded-[10px] text-[14px] transition-colors"
                        style={{ background: value === '' ? 'rgba(201,169,110,0.18)' : 'transparent', color: value === '' ? '#c9a96e' : 'rgba(242,237,228,0.7)' }}
                        onMouseEnter={e => { if (value !== '') e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                        onMouseLeave={e => { if (value !== '') e.currentTarget.style.background = 'transparent' }}
                    >
                        {placeholder}
                    </button>
                    {options.map(o => (
                        <button
                            key={o.value}
                            type="button"
                            onClick={() => onSelect(o.value)}
                            className="w-full text-left px-3.5 py-2.5 rounded-[10px] text-[14px] font-medium transition-colors"
                            style={{ background: value === o.value ? 'rgba(201,169,110,0.18)' : 'transparent', color: value === o.value ? '#c9a96e' : '#f2ede4' }}
                            onMouseEnter={e => { if (value !== o.value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                            onMouseLeave={e => { if (value !== o.value) e.currentTarget.style.background = 'transparent' }}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

function SearchBar({ t, meta }: { t: T; meta: SearchMeta }) {
    const router = useRouter()
    const [open, setOpen] = useState<string | null>(null)
    const [sel, setSel] = useState({ city: '', brand: '', fuel: '', price: '' })
    const boxRef = useRef<HTMLDivElement>(null)

    // Закрытие выпадающих списков по клику вне поиска
    useEffect(() => {
        if (!open) return
        function onDoc(e: MouseEvent) {
            if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(null)
        }
        document.addEventListener('mousedown', onDoc)
        return () => document.removeEventListener('mousedown', onDoc)
    }, [open])

    const cityOpts: SelectOption[] = meta.cities.map(c => ({ value: c, label: c }))
    const brandOpts: SelectOption[] = meta.brands.map(b => ({ value: b, label: b }))
    const fuelOpts: SelectOption[] = [
        { value: 'petrol', label: t.search_fuel_petrol },
        { value: 'diesel', label: t.search_fuel_diesel },
        { value: 'electric', label: t.search_fuel_electric },
        { value: 'hybrid', label: t.search_fuel_hybrid },
    ]
    // value кодирует диапазон цены: max:<n> или min:<n>
    const priceOpts: SelectOption[] = [
        { value: 'max:30000', label: t.search_price_1 },
        { value: 'max:50000', label: t.search_price_2 },
        { value: 'max:80000', label: t.search_price_3 },
        { value: 'min:80000', label: t.search_price_4 },
    ]

    function pick(field: keyof typeof sel, v: string) {
        setSel(prev => ({ ...prev, [field]: v }))
        setOpen(null)
    }

    function runSearch() {
        const params = new URLSearchParams()
        if (sel.city) params.set('city', sel.city)
        if (sel.brand) params.set('brand', sel.brand)
        if (sel.fuel) params.set('fuel_type', sel.fuel)
        if (sel.price) {
            const [kind, amount] = sel.price.split(':')
            params.set(kind === 'min' ? 'priceMin' : 'priceMax', amount)
        }
        const qs = params.toString()
        router.push(qs ? `/rent?${qs}` : '/rent')
    }

    const hasSel = sel.city || sel.brand || sel.fuel || sel.price

    return (
        <div
            ref={boxRef}
            className="grid gap-2 rounded-[22px] p-2.5 max-w-[920px]"
            style={{
                gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.13)',
            }}
        >
            <HeroSelect
                label={t.search_city} placeholder={t.search_city_any} value={sel.city} options={cityOpts}
                isOpen={open === 'city'} onToggle={() => setOpen(open === 'city' ? null : 'city')} onSelect={v => pick('city', v)}
            />
            <HeroSelect
                label={t.search_brand} placeholder={t.search_brand_any} value={sel.brand} options={brandOpts}
                isOpen={open === 'brand'} onToggle={() => setOpen(open === 'brand' ? null : 'brand')} onSelect={v => pick('brand', v)}
            />
            <HeroSelect
                label={t.search_fuel} placeholder={t.search_fuel_any} value={sel.fuel} options={fuelOpts}
                isOpen={open === 'fuel'} onToggle={() => setOpen(open === 'fuel' ? null : 'fuel')} onSelect={v => pick('fuel', v)}
            />
            <HeroSelect
                label={t.search_price} placeholder={t.search_price_any} value={sel.price} options={priceOpts}
                isOpen={open === 'price'} onToggle={() => setOpen(open === 'price' ? null : 'price')} onSelect={v => pick('price', v)}
            />
            <div className="flex items-stretch gap-2">
                {hasSel && (
                    <button
                        type="button"
                        onClick={() => { setSel({ city: '', brand: '', fuel: '', price: '' }); setOpen(null) }}
                        className="px-3 rounded-[14px] text-[13px] font-medium text-[#f2ede4]/70 hover:text-[#f2ede4] transition-colors"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                        aria-label={t.search_reset}
                    >
                        ✕
                    </button>
                )}
                <button
                    type="button"
                    onClick={runSearch}
                    className="rounded-[14px] px-6 flex items-center gap-3 font-semibold text-[14px] text-[#0b0b0c] transition-all duration-200 hover:opacity-90"
                    style={{ background: '#f2ede4' }}
                >
                    {t.search_cta}
                    <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#0b0b0c', color: '#f2ede4' }}>
                        <ArrowIcon />
                    </span>
                </button>
            </div>
        </div>
    )
}

function Hero({ t, meta }: { t: T; meta: SearchMeta }) {
    return (
        <section
            className="relative overflow-hidden text-[#f2ede4]"
            style={{ minHeight: 820, background: '#0b0b0c', borderBottomLeftRadius: 60, borderBottomRightRadius: 60 }}
            id="hero"
        >
            {/* bg image */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=2200&q=80)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.78) contrast(1.02)',
                }}
            />
            {/* gradient overlay */}
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg,rgba(11,11,12,0.55) 0%,rgba(11,11,12,0.15) 30%,rgba(11,11,12,0.5) 75%,rgba(11,11,12,0.9) 100%)' }}
            />

            {/* watermark */}
            <div
                className="absolute pointer-events-none select-none lowercase tracking-[-0.04em] text-white/[0.05]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(220px,30vw,460px)', lineHeight: 1, top: '8%', left: '-2%', right: '-2%', whiteSpace: 'nowrap', zIndex: 1 }}
            >
                nomaddrive
            </div>


            {/* right stats */}
            <div className="absolute right-7 hidden lg:flex flex-col gap-7 text-right" style={{ top: '38%', zIndex: 3 }}>
                {([
                    { n: t.stat_1_n, l: t.stat_1_l },
                    { n: t.stat_2_n, l: t.stat_2_l },
                    { n: t.stat_3_n, l: t.stat_3_l },
                ] as { n: string; l: string }[]).map((s) => (
                    <div key={s.n} className="text-[#f2ede4]">
                        <div className="font-bold text-[28px] tracking-[-0.01em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.n}</div>
                        <div className="text-[10.5px] uppercase tracking-[0.16em] opacity-75 mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.l}</div>
                    </div>
                ))}
            </div>

            {/* hero inner */}
            <div className="relative max-w-[1440px] mx-auto px-7 pt-[130px] pb-[60px]" style={{ zIndex: 2 }}>
                <div className="text-[11px] uppercase tracking-[0.18em] opacity-70 mb-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {t.hero_eyebrow}
                </div>
                <h1
                    className="text-[#f2ede4] mb-7 uppercase tracking-[-0.02em]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(48px,7.2vw,104px)', lineHeight: 0.95, maxWidth: 1100 }}
                >
                    {t.hero_title_1}<br />
                    <em style={{ fontStyle: 'normal', color: '#c9a96e' }}>{t.hero_title_em}</em>{' '}{t.hero_title_2}
                </h1>
                <p className="max-w-[520px] text-[17px] leading-[1.55] mb-10" style={{ color: 'rgba(242,237,228,0.78)' }}>
                    {t.hero_sub}
                </p>
                <div className="hidden md:block">
                    <SearchBar t={t} meta={meta} />
                </div>
                <div className="md:hidden flex gap-3 mt-2">
                    <Link href="/rent" className="h-12 px-7 rounded-full flex items-center gap-2 font-semibold text-[14px] text-[#0b0b0c]" style={{ background: '#f2ede4' }}>
                        {t.search_cta} <ArrowIcon />
                    </Link>
                </div>
            </div>
        </section>
    )
}

function Ticker({ t }: { t: T }) {
    const items = t.ticker_items
    const row = (
        <span className="flex gap-14 items-center">
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-14">
                    <span>{item}</span>
                    <span style={{ color: '#c9a96e' }}>✦</span>
                </span>
            ))}
        </span>
    )
    return (
        <div className="overflow-hidden py-[18px]" style={{ background: '#0b0b0c', color: '#f2ede4', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 22, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
            <div className="nd-ticker-track gap-14">
                {row}{row}
            </div>
        </div>
    )
}

function VehicleCard({ v }: { v: VehicleView }) {
    return (
        <Link
            href={v.href}
            className="rounded-[28px] p-[22px] flex flex-col gap-4 border border-transparent cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#dbd4c5]"
            style={{ background: '#faf7f1' }}
        >
            <div className="flex flex-col items-center text-center gap-1">
                <span className="font-bold text-[18px] tracking-[0.04em] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#0b0b0c' }}>{v.brand}</span>
                <span className="font-bold text-[18px] tracking-[0.04em] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#0b0b0c' }}>{v.model}</span>
            </div>
            <div className="h-[170px] rounded-[18px] overflow-hidden flex items-center justify-center" style={{ background: '#e8e1d3' }}>
                {v.img
                    ? <img src={v.img} alt={v.brand + ' ' + v.model} loading="lazy" className="w-full h-full object-cover" />
                    : <span className="text-[40px]">🚗</span>}
            </div>
            <div className="flex flex-wrap gap-3 pt-1 border-t border-dashed border-[#dbd4c5] text-[11px] tracking-[0.06em]" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#8c8a85' }}>
                {v.seats > 0 && <span className="flex items-center gap-1"><SeatIcon /> {v.seats}</span>}
                <span className="text-[#0b0b0c]">{v.year}</span>
                {v.meta && <span>{v.meta}</span>}
            </div>
            <div className="flex items-center justify-between gap-3">
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: '#0b0b0c' }}>
                    {v.price}<small className="text-[13px] font-medium ml-0.5" style={{ color: '#8c8a85', fontFamily: 'inherit' }}>{v.unit}</small>
                </div>
                <span className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-[#f2ede4]" style={{ background: '#0b0b0c' }}>
                    <ArrowIcon />
                </span>
            </div>
        </Link>
    )
}

function SellPanel({ t }: { t: T }) {
    const [step, setStep] = useState(1)
    return (
        <div className="rounded-[28px] p-10 grid gap-14 items-center" style={{ background: '#faf7f1', gridTemplateColumns: '1fr 1fr', minHeight: 380 }}>
            <div>
                <div className="text-[11px] uppercase tracking-[0.18em] mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#8c8a85' }}>{t.sell_eyebrow}</div>
                <h3 className="uppercase tracking-[-0.02em] mb-4 leading-[0.95]" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 36, color: '#0b0b0c' }}>
                    {t.sell_title_1}<br />
                    <em style={{ fontStyle: 'normal', color: '#c9a96e' }}>{t.sell_title_em}</em>
                </h3>
                <p className="text-[15px] leading-[1.55] mb-6 max-w-[380px]" style={{ color: '#8c8a85' }}>{t.sell_sub}</p>
                <Link href="#contact" className="inline-flex items-center gap-3 rounded-full font-semibold text-[15px] px-6 py-[18px] text-[#f2ede4] transition-all duration-200 hover:opacity-90" style={{ background: '#0b0b0c' }}>
                    {t.sell_cta}
                    <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#c9a96e', color: '#1a0e00' }}><ArrowIcon /></span>
                </Link>
            </div>
            <div className="flex flex-col gap-2">
                {t.sell_steps.map((s, i) => {
                    const n = i + 1
                    const isOpen = step === n
                    return (
                        <div
                            key={i}
                            onClick={() => setStep(n)}
                            className="rounded-[20px] px-[26px] py-[22px] flex items-center gap-5 cursor-pointer transition-all duration-200"
                            style={{
                                background: isOpen ? '#0b0b0c' : 'transparent',
                                color: isOpen ? '#f2ede4' : '#0b0b0c',
                                border: isOpen ? 'none' : '1px solid #dbd4c5',
                            }}
                        >
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isOpen ? 36 : 22, width: 40, transition: 'font-size 0.2s', flexShrink: 0 }}>{n}</span>
                            <div className="flex-1">
                                <div className="font-bold text-[16px] uppercase tracking-[0.04em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.label}</div>
                                {isOpen && <div className="text-[13px] mt-1.5 leading-[1.5] opacity-70">{s.body}</div>}
                            </div>
                            <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: isOpen ? '#c9a96e' : '#e8e1d3', color: isOpen ? '#1a0e00' : '#0b0b0c' }}>
                                <ArrowIcon />
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

type Mode = 'rent' | 'buy' | 'sell' | 'parts'

function Listings({ t, mode, setMode, data }: { t: T; mode: Mode; setMode: (m: Mode) => void; data: Omit<LandingData, 'searchMeta'> }) {
    const modes: { id: Mode; label: string; badge: string }[] = [
        { id: 'rent', label: t.mode_rent, badge: t.mode_badge_rent },
        { id: 'buy', label: t.mode_buy, badge: t.mode_badge_buy },
        { id: 'sell', label: t.mode_sell, badge: t.mode_badge_sell },
        { id: 'parts', label: t.mode_parts, badge: t.mode_badge_parts },
    ]
    const titles = { rent: t.title_rent, buy: t.title_buy, sell: t.title_sell, parts: t.title_parts }
    const subs = { rent: t.sub_rent, buy: t.sub_buy, sell: t.sub_sell, parts: t.sub_parts }
    const btns = { rent: t.btn_rent, buy: t.btn_buy, sell: t.btn_sell, parts: t.btn_parts }
    const btnHref: Record<Mode, string> = { rent: '/rent', buy: '/sale', sell: '#contact', parts: '/parts' }
    const views: VehicleView[] = mode === 'buy'
        ? data.saleCars.map(saleToView)
        : data.rentCars.map(rentToView)

    return (
        <section className="py-[110px]" style={{ background: '#f2ede4' }} id="fleet">
            <div className="max-w-[1440px] mx-auto px-7">
                {/* Mode tabs */}
                <div className="flex justify-center -mt-[110px] mb-0 relative z-10">
                    <div className="rounded-full p-2 flex gap-1" style={{ background: '#0b0b0c', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.4)' }}>
                        {modes.map(m => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                className="px-[26px] py-[14px] rounded-full font-semibold text-[14px] flex items-center gap-2.5 transition-all duration-250"
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    background: mode === m.id ? '#f2ede4' : 'transparent',
                                    color: mode === m.id ? '#0b0b0c' : 'rgba(242,237,228,0.6)',
                                }}
                            >
                                {m.label}
                                <span
                                    className="text-[10px] px-1.5 py-0.5 rounded-[6px]"
                                    style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        background: mode === m.id ? '#0b0b0c' : 'rgba(255,255,255,0.10)',
                                        color: mode === m.id ? '#f2ede4' : 'inherit',
                                    }}
                                >
                                    {m.badge}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section head */}
                <div className="grid gap-16 items-end mb-16" style={{ gridTemplateColumns: '1.4fr 1fr', marginTop: 80 }}>
                    <h2 className="uppercase tracking-[-0.02em]" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(40px,5.4vw,76px)', lineHeight: 0.95, maxWidth: '14ch', color: '#0b0b0c' }}>
                        {titles[mode][0]}<em style={{ fontStyle: 'normal', color: '#c9a96e' }}>{titles[mode][1]}</em>
                    </h2>
                    <p className="text-[16px] leading-[1.55] max-w-[420px]" style={{ color: '#8c8a85' }}>{subs[mode]}</p>
                </div>

                {/* Content */}
                {mode === 'parts' ? (
                    <div className="grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                        {data.parts.map((p, i) => {
                            const dark = i % 2 === 1
                            const tag = [p.category, p.oem_number && `OEM ${p.oem_number}`].filter(Boolean).join(' · ') || p.brand
                            return (
                                <Link
                                    href="/parts"
                                    key={p.id}
                                    className="rounded-[28px] p-[22px] flex flex-col gap-[18px] min-h-[280px] transition-all duration-250 hover:-translate-y-1 cursor-pointer"
                                    style={{ background: dark ? '#0b0b0c' : '#faf7f1', color: dark ? '#f2ede4' : '#0b0b0c' }}
                                >
                                    <div className="h-[110px] rounded-[12px] overflow-hidden flex items-center justify-center" style={{ background: '#e8e1d3' }}>
                                        {p.image_urls?.[0]
                                            ? <img src={p.image_urls[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                                            : <span className="text-[28px]">🔧</span>}
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.14em]" style={{ fontFamily: "'JetBrains Mono', monospace", color: dark ? 'rgba(242,237,228,0.55)' : '#8c8a85' }}>{tag}</span>
                                    <h4 className="font-bold text-[17px] uppercase tracking-[0.02em] line-clamp-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.name}</h4>
                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="font-bold text-[18px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.price.toLocaleString('ru-RU')} ₸</span>
                                        <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: dark ? '#c9a96e' : '#0b0b0c', color: dark ? '#1a0e00' : '#f2ede4' }}>
                                            <ArrowIcon size={14} />
                                        </span>
                                    </div>
                                </Link>
                            )
                        })}
                        {data.parts.length === 0 && (
                            <p className="col-span-4 text-center py-12 text-[15px]" style={{ color: '#8c8a85' }}>Каталог запчастей скоро пополнится</p>
                        )}
                    </div>
                ) : mode === 'sell' ? (
                    <SellPanel t={t} />
                ) : (
                    <div className="grid grid-cols-3 gap-[22px]">
                        {views.slice(0, 6).map((v) => <VehicleCard key={v.href} v={v} />)}
                        {views.length === 0 && (
                            <p className="col-span-3 text-center py-12 text-[15px]" style={{ color: '#8c8a85' }}>Скоро здесь появятся автомобили</p>
                        )}
                    </div>
                )}

                {/* Footer btn */}
                <div className="flex justify-center mt-14">
                    <Link href={btnHref[mode]} className="inline-flex items-center gap-3.5 rounded-full font-semibold text-[15px] px-9 py-[18px] text-[#f2ede4] transition-all duration-200 hover:-translate-y-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif", background: '#0b0b0c' }}>
                        {btns[mode]}
                        <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#c9a96e', color: '#1a0e00' }}><ArrowIcon size={14} /></span>
                    </Link>
                </div>
            </div>
        </section>
    )
}

function Showcase({ t }: { t: T }) {
    return (
        <section className="pt-10 pb-[120px]" style={{ background: '#f2ede4' }} id="about">
            <div className="max-w-[1440px] mx-auto px-7">
                <div className="grid gap-14 items-center" style={{ gridTemplateColumns: '0.95fr 1.05fr' }}>
                    <div className="relative rounded-[40px] overflow-hidden" style={{ aspectRatio: '1.02/1', background: '#15151a' }}>
                        <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80" alt="Detail shot" className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,transparent 50%,rgba(11,11,12,0.4) 100%)' }} />
                        {/* chips */}
                        <div className="absolute z-10 rounded-[18px] px-[18px] py-3.5 text-white" style={{ top: 36, left: 36, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.28)', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                            {t.showcase_chip1}<br /><span className="font-normal opacity-[0.78] text-[12px]">{t.showcase_chip1s}</span>
                        </div>
                        <div className="absolute z-10 rounded-[18px] px-[18px] py-3.5 text-white" style={{ top: '46%', right: 38, transform: 'translateY(-50%)', background: 'rgba(201,169,110,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.28)', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                            {t.showcase_chip2}<br /><span className="font-normal opacity-[0.78] text-[12px]">{t.showcase_chip2s}</span>
                        </div>
                        <div className="absolute z-10 rounded-[18px] px-[18px] py-3.5 text-white" style={{ bottom: 36, left: 36, background: 'rgba(20,20,28,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.20)', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                            {t.showcase_chip3}<br /><span className="font-normal opacity-[0.78] text-[12px]">{t.showcase_chip3s}</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] mb-4" style={{ fontFamily: "'JetBrains Mono',monospace", color: '#8c8a85' }}>{t.showcase_eyebrow}</div>
                        <h2 className="uppercase tracking-[-0.02em] mb-6" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(36px,4.6vw,64px)', lineHeight: 0.95, color: '#0b0b0c' }}>
                            {t.showcase_title_1}<br />{t.showcase_title_2}<br /><em style={{ fontStyle: 'normal', color: '#c9a96e' }}>{t.showcase_title_em}</em>
                        </h2>
                        <p className="text-[16px] leading-[1.55] mb-7 max-w-[480px]" style={{ color: '#8c8a85' }}>{t.showcase_p1}</p>
                        <p className="text-[16px] leading-[1.55] mb-7 max-w-[480px]" style={{ color: '#8c8a85' }}>{t.showcase_p2}</p>
                        <Link href="#how" className="inline-flex items-center gap-3 rounded-full font-semibold text-[15px] px-6 py-[18px] text-[#f2ede4] transition-all duration-200 hover:opacity-90" style={{ fontFamily: "'Space Grotesk',sans-serif", background: '#0b0b0c' }}>
                            {t.showcase_btn}
                            <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#c9a96e', color: '#1a0e00' }}><ArrowIcon size={14} /></span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

function Why({ t }: { t: T }) {
    const cards = [
        { dark: true, title: t.why_1_title, body: t.why_1_body, corner: true },
        { light: true, title: t.why_2_title, body: t.why_2_body, corner: true },
        { dark: true, title: t.why_3_title, body: t.why_3_body, corner: true },
        { light: true, title: t.why_4_title, body: t.why_4_body, corner: true },
        { feature: true, title: t.why_5_title, body: t.why_5_body },
        { light: true, title: t.why_6_title, body: t.why_6_body, corner: true },
    ]

    return (
        <section style={{ background: '#0b0b0c', color: '#f2ede4', paddingTop: 130, borderTopLeftRadius: 60, borderTopRightRadius: 60, position: 'relative', overflow: 'hidden' }}>
            <div className="max-w-[1440px] mx-auto px-7">
                <div className="text-center mb-16">
                    <div className="text-[11px] uppercase tracking-[0.18em] mb-4" style={{ fontFamily: "'JetBrains Mono',monospace", color: 'rgba(242,237,228,0.55)' }}>{t.why_eyebrow}</div>
                    <h2 className="uppercase tracking-[-0.02em] mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(40px,5.4vw,76px)', lineHeight: 0.95 }}>
                        {t.why_title_1}<br /><em style={{ fontStyle: 'normal', color: '#c9a96e' }}>{t.why_title_em}</em>{t.why_title_2}
                    </h2>
                    <p className="text-[16px] leading-[1.55] text-center max-w-[480px] mx-auto" style={{ color: 'rgba(242,237,228,0.55)' }}>{t.why_sub}</p>
                </div>

                <div className="grid grid-cols-3 gap-[18px]">
                    {cards.map((c, i) => {
                        const [pre, em, post] = c.title as [string, string, string]
                        const isLight = c.light
                        const isFeature = c.feature
                        const isDark = c.dark
                        return (
                            <div
                                key={i}
                                className="rounded-[28px] p-8 min-h-[290px] flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                                style={{
                                    background: isLight ? '#faf7f1' : isFeature ? 'linear-gradient(165deg,#20202a 0%,#2b2438 50%,#322640 100%)' : '#15151a',
                                    border: isLight ? '1px solid transparent' : isFeature ? '1px solid rgba(255,255,255,0.08)' : '1px solid #2a2a30',
                                    color: isLight ? '#0b0b0c' : '#f2ede4',
                                }}
                            >
                                <div>
                                    <h3 className="font-bold text-[22px] uppercase tracking-[-0.01em] mb-3.5 leading-[1.1]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                                        {pre}<em style={{ fontStyle: 'normal', color: isLight ? '#0b0b0c' : '#c9a96e' }}>{em}</em>{post}
                                    </h3>
                                    <p className="text-[14px] leading-[1.55] max-w-[280px]" style={{ color: isLight ? '#8c8a85' : 'rgba(242,237,228,0.65)' }}>{c.body}</p>
                                </div>
                                {c.corner && (
                                    <span className="self-end w-11 h-11 rounded-full flex items-center justify-center mt-4" style={{ background: isLight ? '#0b0b0c' : 'rgba(255,255,255,0.06)', border: isLight ? 'none' : '1px solid rgba(255,255,255,0.12)', color: '#f2ede4' }}>
                                        <ArrowIcon />
                                    </span>
                                )}
                                {c.feature && (
                                    <span className="font-bold text-[32px] tracking-[-0.02em] mt-4" style={{ fontFamily: "'Space Grotesk',sans-serif", background: 'linear-gradient(90deg,#fff,#c7b9ff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                                        NomadDrive
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* why foot */}
            <div className="text-center px-7 pt-20 pb-[110px] relative">
                <p className="font-semibold leading-[1.25] mx-auto" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(20px,2.4vw,32px)', maxWidth: 820, color: 'rgba(242,237,228,0.92)', letterSpacing: '-0.01em' }}>
                    {t.why_foot[0]}<em style={{ fontStyle: 'normal', color: '#c9a96e' }}>{t.why_foot[1]}</em>{t.why_foot[2]}
                </p>
                <div className="absolute inset-x-0 bottom-[-20px] text-center pointer-events-none select-none lowercase tracking-[-0.04em] text-white/[0.035]" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(180px,26vw,400px)', lineHeight: 0.8 }}>
                    nomaddrive
                </div>
            </div>
        </section>
    )
}

function Steps({ t }: { t: T }) {
    const [open, setOpen] = useState(1)
    return (
        <section className="py-[80px] pb-[130px]" style={{ background: '#0b0b0c', color: '#f2ede4' }} id="how">
            <div className="max-w-[1440px] mx-auto px-7">
                <div className="relative rounded-[48px] p-9 overflow-hidden" style={{ background: '#15151a', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, minHeight: 620 }}>
                    {/* background photo */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(11,11,12,0.85) 0%,rgba(11,11,12,0.45) 45%,rgba(11,11,12,0.2) 100%)' }} />
                    </div>

                    {/* left */}
                    <div className="relative z-10 flex flex-col justify-between py-3.5 px-2">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.18em] mb-4" style={{ fontFamily: "'JetBrains Mono',monospace", color: 'rgba(242,237,228,0.7)' }}>{t.steps_eyebrow}</div>
                            <h2 className="uppercase tracking-[-0.02em] mb-6 leading-[0.95]" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(36px,4.6vw,64px)' }}>
                                {t.steps_title_1}<br /><em style={{ fontStyle: 'normal', color: '#c9a96e' }}>{t.steps_title_em}</em>{t.steps_title_2 && <><br />{t.steps_title_2}</>}
                            </h2>
                            <p className="text-[15px] leading-[1.55] max-w-[380px] mb-7" style={{ color: 'rgba(242,237,228,0.72)' }}>{t.steps_sub}</p>
                        </div>
                        <Link href="/rent" className="self-start inline-flex items-center gap-3.5 rounded-full font-semibold text-[14px] px-6 py-3.5 text-[#0b0b0c] transition-all duration-200 hover:opacity-90" style={{ background: '#f2ede4' }}>
                            {t.steps_cta}
                            <span className="w-[34px] h-[34px] rounded-full flex items-center justify-center" style={{ background: '#0b0b0c', color: '#f2ede4' }}><ArrowIcon size={14} /></span>
                        </Link>
                    </div>

                    {/* right steps */}
                    <div className="relative z-10 flex flex-col gap-3">
                        {t.steps.map((s, i) => {
                            const n = i + 1
                            const isOpen = open === n
                            return (
                                <div
                                    key={i}
                                    onClick={() => setOpen(n)}
                                    className={`rounded-[24px] px-[26px] py-[22px] cursor-pointer transition-all duration-300 ${isOpen ? 'flex-1' : ''}`}
                                    style={{ background: isOpen ? 'rgba(15,15,22,0.85)' : 'rgba(20,20,28,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.10)' }}
                                >
                                    <div className="flex items-center gap-5 justify-between">
                                        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: isOpen ? 60 : 22, color: '#f2ede4', width: 32, transition: 'font-size 0.2s', flexShrink: 0 }}>{n}</span>
                                        <div className="flex-1">
                                            <div className="font-bold text-[16px] uppercase tracking-[0.02em]" style={{ fontFamily: "'Space Grotesk',sans-serif", color: '#f2ede4' }}>
                                                {s.t1}<em style={{ fontStyle: 'normal', color: '#c9a96e' }}>{s.em}</em>{s.t2}
                                            </div>
                                        </div>
                                        <span className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300`} style={{ background: isOpen ? '#c9a96e' : 'rgba(255,255,255,0.08)', border: isOpen ? 'none' : '1px solid rgba(255,255,255,0.14)', color: isOpen ? '#1a0e00' : '#f2ede4', transform: isOpen ? 'rotate(-45deg)' : 'none' }}>
                                            <ArrowIcon size={14} />
                                        </span>
                                    </div>
                                    <div className={`nd-step-body ${isOpen ? 'nd-step-open' : ''}`}>
                                        <p className="text-[14px] leading-[1.55]" style={{ color: 'rgba(242,237,228,0.7)' }}>{s.body}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

function Testimonials({ t }: { t: T }) {
    const [idx, setIdx] = useState(1)
    const testimonials = t.testimonials
    const positions = [
        (idx - 1 + testimonials.length) % testimonials.length,
        idx % testimonials.length,
        (idx + 1) % testimonials.length,
    ]
    return (
        <section className="pt-[30px] pb-[130px]" style={{ background: '#f2ede4' }} id="reviews">
            <div className="max-w-[1440px] mx-auto px-7">
                <div className="grid items-end mb-16" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 64 }}>
                    <h2 className="uppercase tracking-[-0.02em] leading-[0.95]" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(40px,5.4vw,76px)', color: '#0b0b0c', maxWidth: '14ch' }}>
                        {t.testi_title_1}<br /><em style={{ fontStyle: 'normal', color: '#c9a96e' }}>{t.testi_title_em}</em>{t.testi_title_2}
                    </h2>
                    <div className="flex gap-2.5 justify-end">
                        {(['prev', 'next'] as const).map(dir => (
                            <button
                                key={dir}
                                onClick={() => setIdx(dir === 'prev' ? (idx + testimonials.length - 1) % testimonials.length : (idx + 1) % testimonials.length)}
                                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                                style={{ background: '#0b0b0c', color: '#f2ede4' }}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                    {dir === 'prev' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid gap-[22px] items-center" style={{ gridTemplateColumns: '1fr 1.15fr 1fr' }}>
                    {positions.map((p, slot) => {
                        const card = testimonials[p]
                        const isFeat = slot === 1
                        return (
                            <article
                                key={slot}
                                className="rounded-[28px] p-7 min-h-[260px] flex flex-col gap-4 transition-all duration-300"
                                style={{
                                    background: isFeat ? 'linear-gradient(155deg,#1c1c24 0%,#2a2533 100%)' : '#faf7f1',
                                    color: isFeat ? '#f2ede4' : '#0b0b0c',
                                    transform: isFeat ? 'scale(1.04)' : 'scale(1)',
                                }}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-[20px]" style={{ background: isFeat ? '#c9a96e' : '#0b0b0c', color: isFeat ? '#1a0e00' : '#f2ede4', fontFamily: "'Space Grotesk',sans-serif" }}>
                                        {card.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-[17px] uppercase tracking-[0.04em]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{card.name}</div>
                                        <div className="text-[13px] tracking-[2px]" style={{ color: isFeat ? '#c9a96e' : '#0b0b0c' }}>{'★'.repeat(card.stars)}</div>
                                    </div>
                                </div>
                                <p className="text-[14px] leading-[1.55] flex-1" style={{ color: isFeat ? 'rgba(242,237,228,0.85)' : '#8c8a85' }}>{card.text}</p>
                                <span className="self-end w-9 h-9 rounded-full flex items-center justify-center mt-auto" style={{ background: isFeat ? 'rgba(255,255,255,0.08)' : '#0b0b0c', color: '#f2ede4' }}>
                                    <ArrowIcon size={14} />
                                </span>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

function FAQ({ t }: { t: T }) {
    const [open, setOpen] = useState<number>(-1)
    const items = t.faq
    return (
        <section className="pb-[80px]" style={{ background: '#f2ede4' }} id="faq">
            <div className="max-w-[1440px] mx-auto px-7">
                <div className="text-center mb-14">
                    <h2 className="uppercase tracking-[-0.04em]" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(56px,8vw,120px)', color: '#0b0b0c', lineHeight: 0.9 }}>FAQ</h2>
                </div>
                <div className="max-w-[920px] mx-auto flex flex-col gap-3.5">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => setOpen(open === i ? -1 : i)}
                            className="rounded-[24px] px-8 py-[26px] flex gap-6 items-start cursor-pointer transition-colors"
                            style={{ background: '#faf7f1' }}
                        >
                            <span className="font-bold text-[16px] pt-0.5 flex-shrink-0 w-8" style={{ fontFamily: "'Space Grotesk',sans-serif", color: '#0b0b0c' }}>{String(i + 1).padStart(2, '0')}</span>
                            <div className="flex-1">
                                <div className="font-bold text-[16px] uppercase tracking-[0.04em] leading-[1.3]" style={{ fontFamily: "'Space Grotesk',sans-serif", color: '#0b0b0c' }}>{item.q}</div>
                                {open === i && (
                                    <div className="mt-3.5 text-[14px] leading-[1.6]" style={{ color: '#8c8a85' }}>
                                        {item.a.length === 1 ? <p>{item.a[0]}</p> : (
                                            <ul className="list-disc ml-4 space-y-1.5">{item.a.map((line, j) => <li key={j}>{line}</li>)}</ul>
                                        )}
                                    </div>
                                )}
                            </div>
                            <span
                                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                                style={{ background: open === i ? '#c9a96e' : '#0b0b0c', color: open === i ? '#1a0e00' : '#f2ede4', transform: open === i ? 'rotate(180deg)' : 'none' }}
                            >
                                {open === i
                                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                }
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            {/* banner */}
            <div
                className="mt-[80px] h-[320px] relative overflow-hidden"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '60px 60px 0 0' }}
            >
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,transparent 40%,#0b0b0c 100%)' }} />
            </div>
        </section>
    )
}

function CTA({ t }: { t: T }) {
    const [form, setForm] = useState({ name: '', phone: '', email: '' })
    const [sent, setSent] = useState(false)
    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name || !form.email) return
        setSent(true)
        setTimeout(() => setSent(false), 3200)
        setForm({ name: '', phone: '', email: '' })
    }
    return (
        <section className="py-[100px]" style={{ background: '#0b0b0c', color: '#f2ede4' }} id="contact">
            <div className="max-w-[1440px] mx-auto px-7">
                <div className="grid gap-20 items-start" style={{ gridTemplateColumns: '1fr 1.1fr' }}>
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] mb-4" style={{ fontFamily: "'JetBrains Mono',monospace", color: 'rgba(242,237,228,0.55)' }}>{t.cta_eyebrow}</div>
                        <h2 className="uppercase tracking-[-0.02em] mb-[22px] leading-[0.95]" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(40px,5.4vw,76px)' }}>
                            {t.cta_title_1}<br /><em style={{ fontStyle: 'normal', color: '#c9a96e' }}>{t.cta_title_em}</em><br />{t.cta_title_2}
                        </h2>
                        <p className="text-[16px] leading-[1.55] mb-9 max-w-[380px]" style={{ color: 'rgba(242,237,228,0.65)' }}>{t.cta_sub}</p>
                        <div className="flex flex-col gap-2.5">
                            <a href="tel:+77007007000" className="inline-flex items-center gap-2 text-[15px] font-semibold transition-colors hover:text-[#c9a96e]" style={{ color: '#f2ede4' }}>
                                +7 700 700 70 00
                            </a>
                            <a href="mailto:info@nomaddrive.kz" className="inline-flex items-center gap-2 text-[15px] transition-colors hover:text-[#c9a96e]" style={{ color: 'rgba(242,237,228,0.65)' }}>
                                info@nomaddrive.kz
                            </a>
                            <span className="text-[14px]" style={{ color: 'rgba(242,237,228,0.45)' }}>Алматы, проспект Аль-Фараби</span>
                        </div>
                    </div>
                    <form className="flex flex-col gap-3" onSubmit={submit}>
                        {([
                            { key: 'name' as const, placeholder: t.cta_name, type: 'text' },
                            { key: 'phone' as const, placeholder: t.cta_phone, type: 'tel' },
                            { key: 'email' as const, placeholder: t.cta_email, type: 'email' },
                        ]).map(f => (
                            <input
                                key={f.key}
                                type={f.type}
                                placeholder={f.placeholder}
                                value={form[f.key]}
                                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                className="rounded-full px-7 py-5 text-[15px] outline-none transition-colors duration-200"
                                style={{ background: '#f2ede4', color: '#0b0b0c', border: '1px solid transparent', fontFamily: 'inherit' }}
                                onFocus={e => (e.currentTarget.style.borderColor = '#c9a96e')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'transparent')}
                            />
                        ))}
                        <button
                            type="submit"
                            className="self-start mt-1.5 inline-flex items-center gap-[18px] rounded-full font-semibold text-[15px] px-[30px] py-2 transition-all duration-200 hover:bg-[#c9a96e] hover:text-[#1a0e00]"
                            style={{ background: '#f2ede4', color: '#0b0b0c' }}
                        >
                            {sent ? t.cta_sent : t.cta_send}
                            <span className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: '#0b0b0c', color: '#f2ede4' }}><ArrowIcon /></span>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

function LandingFooterBanner({ t }: { t: T }) {
    return (
        <div style={{ background: '#0b0b0c' }}>
            <div className="relative overflow-hidden" style={{ height: 480 }}>
                <div
                    className="absolute inset-0"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=2000&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(11,11,12,0.3) 0%,transparent 30%,rgba(11,11,12,0.7) 100%)' }} />
                </div>
                {/* watermark */}
                <div
                    className="absolute pointer-events-none select-none text-center text-white/[0.06] lowercase tracking-[-0.04em]"
                    style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(220px,30vw,460px)', lineHeight: 1, top: '18%', left: '-3%', right: '-3%', whiteSpace: 'nowrap', zIndex: 2 }}
                >
                    nomaddrive
                </div>
                {/* chips */}
                <div className="absolute inset-0 z-[3]">
                    <div className="absolute rounded-full px-[22px] py-3.5 text-[12px] uppercase tracking-[0.14em] font-semibold text-[#f2ede4]"
                        style={{ top: '38%', right: '8%', background: 'rgba(20,20,24,0.55)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.10)' }}>
                        {t.footer_c1} <span style={{ color: '#c9a96e' }}>{t.footer_c1a}</span>
                    </div>
                    <div className="absolute rounded-full px-[22px] py-3.5 text-[12px] uppercase tracking-[0.14em] font-semibold text-[#f2ede4]"
                        style={{ bottom: '14%', left: '10%', background: 'rgba(20,20,24,0.55)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.10)' }}>
                        {t.footer_c2} <span style={{ color: '#c9a96e' }}>{t.footer_c2a}</span>
                    </div>
                    <div className="absolute rounded-full px-[22px] py-3.5 text-[12px] uppercase tracking-[0.14em] font-semibold text-[#f2ede4]"
                        style={{ bottom: '28%', right: '20%', background: 'rgba(20,20,24,0.55)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.10)' }}>
                        {t.footer_c3} <span style={{ color: '#c9a96e' }}>{t.footer_c3a}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ─── Main export ─── */
export function LandingPage({ rentCars, saleCars, parts, searchMeta }: LandingData) {
    const { lang } = useLanguage()
    const t = T[lang]
    const [mode, setMode] = useState<Mode>('rent')

    return (
        <div className="-mt-[56px] overflow-x-hidden">
            <Hero t={t} meta={searchMeta} />
            <Ticker t={t} />
            <Listings t={t} mode={mode} setMode={setMode} data={{ rentCars, saleCars, parts }} />
            <Showcase t={t} />
            <Why t={t} />
            <Steps t={t} />
            <Testimonials t={t} />
            <FAQ t={t} />
            <CTA t={t} />
            <LandingFooterBanner t={t} />
        </div>
    )
}
