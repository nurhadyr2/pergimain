// Memetakan nama ikon (string dari DB) ke objek ikon FontAwesome.
import {
  faUtensils,
  faMugHot,
  faGamepad,
  faPersonWalking,
  faTree,
  faFilm,
  faBagShopping,
  faCouch,
  faLocationDot,
  faDice,
  faRotateRight,
  faHeart,
  faPlus,
  faPen,
  faTrash,
  faXmark,
  faMapLocationDot,
  faClockRotateLeft,
  faWandMagicSparkles,
  faCircleCheck,
  faCoins,
  faHandPointDown,
} from '@fortawesome/free-solid-svg-icons';

export const categoryIcons = {
  utensils: faUtensils,
  'mug-hot': faMugHot,
  gamepad: faGamepad,
  'person-walking': faPersonWalking,
  tree: faTree,
  film: faFilm,
  'bag-shopping': faBagShopping,
  couch: faCouch,
  'location-dot': faLocationDot,
};

export const iconFor = (name) => categoryIcons[name] || faLocationDot;

export const ui = {
  dice: faDice,
  retry: faRotateRight,
  heart: faHeart,
  plus: faPlus,
  pen: faPen,
  trash: faTrash,
  close: faXmark,
  map: faMapLocationDot,
  history: faClockRotateLeft,
  magic: faWandMagicSparkles,
  done: faCircleCheck,
  coins: faCoins,
  point: faHandPointDown,
};
