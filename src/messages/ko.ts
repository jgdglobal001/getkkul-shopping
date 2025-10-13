interface Messages {
  common: {
    home: string;
    products: string;
    categories: string;
    offers: string;
    about: string;
    contact: string;
    inquiry: string;
    faqs: string;
    cart: string;
    checkout: string;
    account: string;
    orders: string;
    favorites: string;
    login: string;
    logout: string;
    register: string;
    search: string;
    filter: string;
    sort: string;
    price: string;
    quantity: string;
    total: string;
    subtotal: string;
    shipping: string;
    tax: string;
    discount: string;
    close: string;
    cancel: string;
    confirm: string;
    save: string;
    edit: string;
    delete: string;
    add: string;
    remove: string;
    view: string;
    back: string;
    next: string;
    previous: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  header: {
    welcome: string;
    language: string;
    currency: string;
    profile: string;
    settings: string;
    help: string;
    signIn: string;
    signUp: string;
    myAccount: string;
    myOrders: string;
    myWishlist: string;
    signOut: string;
  };
  footer: {
    description: string;
    myAccount: string;
    information: string;
    followUs: string;
    newsletter: string;
    newsletterDesc: string;
    subscribe: string;
    emailPlaceholder: string;
    copyright: string;
  };
  home: {
    title: string;
    bestSellers: string;
    bestSellersDesc: string;
    newArrivals: string;
    newArrivalsDesc: string;
    specialOffers: string;
    specialOffersDesc: string;
    viewMore: string;
  };
  product: {
    addToCart: string;
    buyNow: string;
    outOfStock: string;
    inStock: string;
    description: string;
    specifications: string;
    reviews: string;
    relatedProducts: string;
    features: string;
    warranty: string;
    returnPolicy: string;
    size: string;
    color: string;
    material: string;
    brand: string;
  };
  cart: {
    title: string;
    empty: string;
    emptyDesc: string;
    continueShopping: string;
    checkout: string;
    removeItem: string;
    updateQuantity: string;
    item: string;
    items: string;
  };
  auth: {
    signIn: string;
    signUp: string;
    forgotPassword: string;
    rememberMe: string;
    dontHaveAccount: string;
    alreadyHaveAccount: string;
    createAccount: string;
    signInWith: string;
    orContinueWith: string;
  };
  validation: {
    required: string;
    email: string;
    password: string;
    confirmPassword: string;
    minLength: string;
    maxLength: string;
  };
  error: {
    general: string;
    network: string;
    unauthorized: string;
    notFound: string;
    server: string;
    tryAgain: string;
  };
  success: {
    addedToCart: string;
    orderPlaced: string;
    profileUpdated: string;
    passwordChanged: string;
  };
  currency: {
    usd: string;
    eur: string;
    gbp: string;
    krw: string;
    cny: string;
  };
  language: {
    korean: string;
    english: string;
    chinese: string;
    selectLanguage: string;
    chooseLanguage: string;
    current: string;
    fullySupported: string;
    comingSoon: string;
    currentlySupported: string;
    workingOnMore: string;
  };
}

const koMessages: Messages = {
  "common": {
    "home": "홈",
    "products": "제품",
    "categories": "카테고리",
    "offers": "특가",
    "about": "회사소개",
    "contact": "연락처",
    "inquiry": "문의",
    "faqs": "자주묻는질문",
    "cart": "장바구니",
    "checkout": "결제",
    "account": "계정",
    "orders": "주문",
    "favorites": "즐겨찾기",
    "login": "로그인",
    "logout": "로그아웃",
    "register": "회원가입",
    "search": "검색",
    "filter": "필터",
    "sort": "정렬",
    "price": "가격",
    "quantity": "수량",
    "total": "합계",
    "subtotal": "소계",
    "shipping": "배송",
    "tax": "세금",
    "discount": "할인",
    "close": "닫기",
    "cancel": "취소",
    "confirm": "확인",
    "save": "저장",
    "edit": "수정",
    "delete": "삭제",
    "add": "추가",
    "remove": "제거",
    "view": "보기",
    "back": "뒤로",
    "next": "다음",
    "previous": "이전",
    "loading": "로딩중...",
    "error": "오류",
    "success": "성공",
    "warning": "경고",
    "info": "정보"
  },
  "header": {
    "welcome": "환영합니다",
    "language": "언어",
    "currency": "통화",
    "profile": "프로필",
    "settings": "설정",
    "help": "도움말",
    "signIn": "로그인",
    "signUp": "회원가입",
    "myAccount": "내 계정",
    "myOrders": "내 주문",
    "myWishlist": "위시리스트",
    "signOut": "로그아웃"
  },
  "footer": {
    "description": "우리는 고품질 WordPress 제품을 만드는 디자이너와 개발자 팀입니다.",
    "myAccount": "내 계정",
    "information": "정보",
    "followUs": "팔로우",
    "newsletter": "뉴스레터",
    "newsletterDesc": "최신 뉴스와 특별 할인을 받아보세요",
    "subscribe": "구독하기",
    "emailPlaceholder": "이메일 주소 입력",
    "copyright": "© 2024 Shofy. All rights reserved."
  },
  "home": {
    "title": "홈",
    "bestSellers": "베스트셀러",
    "bestSellersDesc": "고객들이 사랑하는 인기 상품",
    "newArrivals": "신상품",
    "newArrivalsDesc": "컬렉션에 새로 추가된 최신 상품",
    "specialOffers": "특별 할인",
    "specialOffersDesc": "놓치지 마세요! 놀라운 할인 상품",
    "viewMore": "더 보기"
  },
  "product": {
    "addToCart": "장바구니에 담기",
    "buyNow": "바로 구매",
    "outOfStock": "품절",
    "inStock": "재고 있음",
    "description": "제품 설명",
    "specifications": "제품 사양",
    "reviews": "리뷰",
    "relatedProducts": "관련 상품",
    "features": "특징",
    "warranty": "보증",
    "returnPolicy": "반품 정책",
    "size": "사이즈",
    "color": "색상",
    "material": "재료",
    "brand": "브랜드"
  },
  "cart": {
    "title": "장바구니",
    "empty": "장바구니가 비어있습니다",
    "emptyDesc": "상품을 추가해보세요",
    "continueShopping": "쇼핑 계속하기",
    "checkout": "결제하기",
    "removeItem": "상품 제거",
    "updateQuantity": "수량 업데이트",
    "item": "상품",
    "items": "상품들"
  },
  "auth": {
    "signIn": "로그인",
    "signUp": "회원가입",
    "forgotPassword": "비밀번호 찾기",
    "rememberMe": "로그인 상태 유지",
    "dontHaveAccount": "계정이 없으신가요?",
    "alreadyHaveAccount": "이미 계정이 있으신가요?",
    "createAccount": "계정 만들기",
    "signInWith": "다음으로 로그인",
    "orContinueWith": "또는 다음으로 계속"
  },
  "validation": {
    "required": "필수 입력 항목입니다",
    "email": "유효한 이메일 주소를 입력해주세요",
    "password": "비밀번호는 8자 이상이어야 합니다",
    "confirmPassword": "비밀번호가 일치하지 않습니다",
    "minLength": "최소 {min}자 이상 입력해주세요",
    "maxLength": "최대 {max}자까지 입력 가능합니다"
  },
  "error": {
    "general": "오류가 발생했습니다",
    "network": "네트워크 오류입니다",
    "unauthorized": "권한이 없습니다",
    "notFound": "페이지를 찾을 수 없습니다",
    "server": "서버 오류입니다",
    "tryAgain": "다시 시도해주세요"
  },
  "success": {
    "addedToCart": "장바구니에 추가되었습니다",
    "orderPlaced": "주문이 완료되었습니다",
    "profileUpdated": "프로필이 업데이트되었습니다",
    "passwordChanged": "비밀번호가 변경되었습니다"
  },
  "currency": {
    "usd": "미국 달러",
    "eur": "유로",
    "gbp": "영국 파운드",
    "krw": "한국 원",
    "cny": "중국 위안"
  },
  "language": {
    "korean": "한국어",
    "english": "영어",
    "chinese": "중국어",
    "selectLanguage": "언어 선택",
    "chooseLanguage": "선호하는 언어를 선택하세요",
    "current": "현재",
    "fullySupported": "완전 지원",
    "comingSoon": "준비중",
    "currentlySupported": "현재 지원되는 언어",
    "workingOnMore": "더 많은 언어를 추가하기 위해 노력하고 있습니다!"
  }
};

export default koMessages;
