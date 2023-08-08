function toCamelCase(str:string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  
  
  function transformKeys(obj:any) {
    const transformed : any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {

        const newKey = key === 'SKU' ? 'code' : key==="Product URL" ? "source" : toCamelCase(key);

        transformed[newKey] = obj[key];
      }
    }
    return transformed;
}
    
export default transformKeys