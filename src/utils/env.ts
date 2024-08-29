const isYL = () => import.meta.env.MODE.includes('yl');

const changeFavicon = () => {
  let favicon = document.querySelector('link[rel="icon"]') as any;
  if (favicon !== null) {
    favicon.href = isYL() ? '/yl_favicon.ico' : '/favicon.ico';
  } else {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = isYL() ? '/yl_favicon.ico' : '/favicon.ico';
    document.head.appendChild(favicon);
  }
};

export const ENV = {
  isYL,
  getDocumentTitle: () =>
    isYL() ? '慧友天工数字化平台' : 'TATA生产智能制造中心',
  changeFavicon
};
