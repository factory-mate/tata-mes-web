const changeFavicon = () => {
  let favicon = document.querySelector('link[rel="icon"]') as any;
  if (favicon !== null) {
    favicon.href = '/favicon.ico';
  } else {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = '/favicon.ico';
    document.head.appendChild(favicon);
  }
};

export const ENV = {
  getDocumentTitle: () => 'TATA生产智能制造中心',
  changeFavicon
};
