const CATEGORIES: Array<[RegExp, string]> = [
  [/бач/i, "Бачки"],
  [/стекло фар/i, "Стёкла"],
  [/фонар/i, "Фонари"],
  [/противотуман|птф/i, "ПТФ"],
  [/поворот/i, "Поворотники"],
  [/ламп/i, "Лампы"],
  [/катушк/i, "Зажигание"],
  [/радиатор/i, "Радиаторы"],
  [/суппорт/i, "Суппорты"],
  [/реш[её]т/i, "Решётки"],
  [/бампер/i, "Бамперы"],
  [/расширител|колесн\w* арок|\bарк/i, "Арки"],
  [/зеркал/i, "Зеркала"],
  [/подкрыл/i, "Подкрылки"],
  [/крыл/i, "Крылья"],
  [/капот/i, "Капоты"],
  [/корпус/i, "Корпуса"],
  [/фар/i, "Фары"],
];

const MAKES = [
  "Mercedes-Benz",
  "Land Rover",
  "Volkswagen",
  "Chevrolet",
  "Vauxhall",
  "Citroen",
  "Peugeot",
  "Renault",
  "Hyundai",
  "Toyota",
  "Nissan",
  "Honda",
  "Mazda",
  "Skoda",
  "Volvo",
  "Lexus",
  "Mitsubishi",
  "Cadillac",
  "Opel",
  "Audi",
  "Ford",
  "Fiat",
  "Seat",
  "Kia",
  "BMW",
  "Jeep",
  "Dodge",
];

export function categoryOf(title: string) {
  for (const [pattern, name] of CATEGORIES) {
    if (pattern.test(title)) return name;
  }
  return "Другое";
}

const JUNK =
  /зарядк|iphone|чехол|настольн\w* час|настенн\w* час|\bчасы\b|сушилк|коврик|куртк|одежд|пила |костюм|аккумулятор|шкатул|dolce|светильник|брюк|ботинк|лонгслив|воздуходув|москит|рубашк|налобн/i;

const AUTO =
  /fowyad|фар|фонар|бампер|реш[её]т|радиатор|арк|суппорт|глушит|гофр|молдинг|кронштейн|клипс|брызговик|ламп|катушк|патрубок|подстакан|заглуш|стекл|бач|накладк|вентилятор|усилител|рамк|линз|тормоз|поворот|птф|зеркал|крыл|капот|подкрыл|выхлоп|отопител/i;

export function belongsOnSite(title: string) {
  if (/fowyad/i.test(title)) return true;
  if (JUNK.test(title)) return false;
  return AUTO.test(title);
}

export function makeOf(title: string) {
  const haystack = title.toLowerCase();
  for (const make of MAKES) {
    if (haystack.includes(make.toLowerCase())) {
      return make === "Mercedes" ? "Mercedes-Benz" : make;
    }
  }
  return null;
}
