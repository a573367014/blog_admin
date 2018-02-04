/**
 * 获取组件名称
 * @param  {react component}
 * @return {string}
 */
export function getDisplayName (WrappedComponent) {
   return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};
