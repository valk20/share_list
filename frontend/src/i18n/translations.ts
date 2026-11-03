export type Language = 'en' | 'he';

export interface Translations {
  brandName: string;
  brandTag: string;
  brandSubtitle: string;
  authGateway: string;
  feed: string;
  newList: string;
  signIn: string;
  logOut: string;
  sanitizationActive: string;
  passwordsRedacted: string;
  signInTitle: string;
  signInSubtitle: string;
  signUpTitle: string;
  signUpSubtitle: string;
  logInTab: string;
  signUpTab: string;
  usernameOrEmail: string;
  usernameOrEmailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  neverLogged: string;
  rememberMe: string;
  forgotPassword: string;
  signInButton: string;
  signingIn: string;
  username: string;
  minThreeChars: string;
  usernamePlaceholder: string;
  emailAddress: string;
  emailPlaceholder: string;
  createPassword: string;
  minSixChars: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  termsAgreement: string;
  signUpButton: string;
  creatingAccount: string;
  securityNotice: string;
  alreadySignedIn: string;
  loggedInAs: string;
  goToFeed: string;
  myProfile: string;
  welcomeBack: string;
  accountCreated: string;
  resetLinkSent: string;
  acceptTermsError: string;
  passwordMismatchError: string;
  theme: string;
  darkMode: string;
  lightMode: string;
  backgroundStyle: string;
  bgMinimal: string;
  bgVibrant: string;
  bgMesh: string;
  bgDarkModern: string;
  // Feed page
  feedTitle: string;
  feedSubtitle: string;
  searchPlaceholder: string;
  createNewList: string;
  byAuthor: string;
  itemsCount: string;
  forkAction: string;
  clonedAlert: string;
  catAll: string;
  catTravel: string;
  catRelocation: string;
  catCareer: string;
  catEvents: string;
  mockList1Title: string;
  mockList1Desc: string;
  mockList2Title: string;
  mockList2Desc: string;
  mockList3Title: string;
  mockList3Desc: string;
  mockList4Title: string;
  mockList4Desc: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: 'ShareList',
    brandTag: 'Phase 3',
    brandSubtitle: 'Social Checklist Network & Preparation Hub',
    authGateway: 'Auth Gateway',
    feed: 'Feed',
    newList: 'New List',
    signIn: 'Sign In',
    logOut: 'Log Out',
    sanitizationActive: 'Sanitization Active',
    passwordsRedacted: 'Passwords Redacted',
    signInTitle: 'Sign in to ShareList',
    signInSubtitle: 'Discover, clone, and curate battle-tested checklists',
    signUpTitle: 'Join ShareList Community',
    signUpSubtitle: 'Start sharing and cloning structured preparation lists',
    logInTab: 'Log In',
    signUpTab: 'Sign Up',
    usernameOrEmail: 'Username or Email',
    usernameOrEmailPlaceholder: 'Enter username or email',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    neverLogged: '✓ Never Logged',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signInButton: 'Sign In to ShareList',
    signingIn: 'Signing In...',
    username: 'Username',
    minThreeChars: 'Min 3 characters',
    usernamePlaceholder: 'Choose unique username',
    emailAddress: 'Email Address',
    emailPlaceholder: 'name@domain.com',
    createPassword: 'Create Password',
    minSixChars: 'Min 6 characters',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter password',
    termsAgreement: 'I agree to the community guidelines and understand lists can be cloned by others.',
    signUpButton: 'Create ShareList Account',
    creatingAccount: 'Creating Account...',
    securityNotice: 'Client passwords are automatically sanitized and never transmitted to logging feeds.',
    alreadySignedIn: 'Already Signed In',
    loggedInAs: 'You are logged in as',
    goToFeed: 'Go to Feed',
    myProfile: 'My Profile',
    welcomeBack: 'Welcome back, {username}! Redirecting...',
    accountCreated: 'Account created! Welcome, {username}. Redirecting...',
    resetLinkSent: 'Password reset link will be sent to your email.',
    acceptTermsError: 'Please accept the community guidelines to create an account.',
    passwordMismatchError: 'Passwords do not match. Please verify both fields.',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    backgroundStyle: 'Background Style',
    bgMinimal: 'Minimal',
    bgVibrant: 'Vibrant Gradient',
    bgMesh: 'Soft Mesh',
    bgDarkModern: 'Dark Modern',
    // Feed Page
    feedTitle: 'Public Checklist Feed',
    feedSubtitle: 'Browse, rate, and clone battle-tested preparation lists curated by experienced community members.',
    searchPlaceholder: 'Search checklists by keyword, event, or category...',
    createNewList: 'Create New List',
    byAuthor: 'by',
    itemsCount: 'items',
    forkAction: 'Fork',
    clonedAlert: 'List "{title}" cloned to your private dashboard!',
    catAll: 'All',
    catTravel: 'Travel',
    catRelocation: 'Relocation',
    catCareer: 'Career',
    catEvents: 'Events',
    mockList1Title: 'Apartment Rental Handover & Inspection Checklist',
    mockList1Desc: 'Thorough step-by-step room inspection, meter readings, and wall-mark protocols before signing.',
    mockList2Title: 'Tokyo 7-Day Travel Itinerary & Packing Guide',
    mockList2Desc: 'Essential train passes, SIM cards, neighborhood stops, and luggage preparation for Japan.',
    mockList3Title: 'Senior Frontend Engineer Tech Interview Preparation',
    mockList3Desc: 'System design, web vitals, state management patterns, and behavioral preparation checklist.',
    mockList4Title: 'Minimalist Wedding Planning Timeline (6 Months)',
    mockList4Desc: 'Stress-free timeline covering vendors, RSVPs, attire, ceremony music, and contingency plans.',
  },
  he: {
    brandName: 'ShareList',
    brandTag: 'שלב 3',
    brandSubtitle: 'רשת שיתוף רשימות ומדריכי הכנה',
    authGateway: 'שער אימות',
    feed: 'פיד רשימות',
    newList: 'רשימה חדשה',
    signIn: 'התחברות',
    logOut: 'התנתקות',
    sanitizationActive: 'סינון אבטחה פעיל',
    passwordsRedacted: 'סיסמאות הוסתרו',
    signInTitle: 'התחברות ל-ShareList',
    signInSubtitle: 'גלה, שכפל ונהל רשימות מומלצות מהקהילה',
    signUpTitle: 'הצטרפות לקהילת ShareList',
    signUpSubtitle: 'התחל לשתף ולשכפל רשימות הכנה מובנות',
    logInTab: 'התחברות',
    signUpTab: 'הרשמה',
    usernameOrEmail: 'שם משתמש או אימייל',
    usernameOrEmailPlaceholder: 'הזן שם משתמש או אימייל',
    password: 'סיסמה',
    passwordPlaceholder: 'הזן את הסיסמה שלך',
    neverLogged: '✓ לעולם לא נרשם ביומן',
    rememberMe: 'זכור אותי',
    forgotPassword: 'שכחת סיסמה?',
    signInButton: 'התחבר ל-ShareList',
    signingIn: 'מתחבר למערכת...',
    username: 'שם משתמש',
    minThreeChars: 'לפחות 3 תווים',
    usernamePlaceholder: 'בחר שם משתמש ייחודי',
    emailAddress: 'כתובת אימייל',
    emailPlaceholder: 'name@domain.com',
    createPassword: 'יצירת סיסמה',
    minSixChars: 'לפחות 6 תווים',
    confirmPassword: 'אימות סיסמה',
    confirmPasswordPlaceholder: 'הזן שוב את הסיסמה',
    termsAgreement: 'אני מסכים לכללי הקהילה ומבין שרשימות עשויות להשתכפל ע״י משתמשים אחרים.',
    signUpButton: 'צור חשבון ב-ShareList',
    creatingAccount: 'יוצר חשבון חדש...',
    securityNotice: 'סיסמאות משתמשים מנוקות אוטומטית ולעולם אינן מועברות ליומני הבקרה.',
    alreadySignedIn: 'מחובר כעת למערכת',
    loggedInAs: 'הנך מחובר בתור',
    goToFeed: 'מעבר לפיד הרשימות',
    myProfile: 'הפרופיל שלי',
    welcomeBack: 'ברוך שובך, {username}! מעביר אותך...',
    accountCreated: 'החשבון נוצר בהצלחה! ברוך הבא, {username}. מעביר...',
    resetLinkSent: 'קישור לאיפוס סיסמה יישלח לכתובת האימייל שלך.',
    acceptTermsError: 'יש לאשר את כללי הקהילה כדי ליצור חשבון.',
    passwordMismatchError: 'הסיסמאות אינן תואמות. אנא בדוק שנית.',
    theme: 'ערכת נושא',
    darkMode: 'מצב כהה',
    lightMode: 'מצב בהיר',
    backgroundStyle: 'סגנון רקע',
    bgMinimal: 'מינימלי',
    bgVibrant: 'גרדיאנט חי',
    bgMesh: 'רשת רכה',
    bgDarkModern: 'מודרני כהה',
    // Feed Page (Hebrew)
    feedTitle: 'פיד רשימות קהילתי',
    feedSubtitle: 'עיין, דרג ושכפל רשימות הכנה בדוקות שנבנו ע״י חברי קהילה מנוסים.',
    searchPlaceholder: 'חיפוש רשימות לפי מילות מפתח, אירוע או קטגוריה...',
    createNewList: 'יצירת רשימה חדשה',
    byAuthor: 'מאת',
    itemsCount: 'פריטים',
    forkAction: 'שכפול',
    clonedAlert: 'הרשימה "{title}" שוכפלה בהצלחה ללוח הבקרה שלך!',
    catAll: 'הכל',
    catTravel: 'נסיעות',
    catRelocation: 'מעבר דירה',
    catCareer: 'קריירה',
    catEvents: 'אירועים',
    mockList1Title: 'רשימת בדיקה ומסירה להשכרת דירה',
    mockList1Desc: 'בדיקה מקיפה חדר אחר חדר, קריאת מונים ופרוטוקול ליקויים לפני חתימה על חוזה.',
    mockList2Title: 'מסלול 7 ימים בטוקיו ומדריך אריזה',
    mockList2Desc: 'כרטיסי רכבת חיוניים, כרטיס סים, המלצות לשכונות ורשימת אריזה מפורטת ליפן.',
    mockList3Title: 'הכנה לראיונות טכניים למפתחי פרונטאנד בכירים',
    mockList3Desc: 'ארכיטקטורת מערכות, ביצועי רשת, תבניות ניהול סטייט והכנה לשאלות התנהגותיות.',
    mockList4Title: 'לוח זמנים לתכנון חתונה מינימליסטית (6 חודשים)',
    mockList4Desc: 'לוח זמנים רגוע הכולל ספקים, אישורי הגעה, ביגוד, מוזיקה ותוכניות גיבוי.',
  },
};
