const getCookie = (name: string): string => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop()! : '';
  };

export { getCookie };