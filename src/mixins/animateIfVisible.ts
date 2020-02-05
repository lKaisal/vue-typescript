import VisibilityObserver from '@/mixins/VisibilityObserver'

function animateIfVisible(
  reverse: boolean = false,
  className: string = 'js-voa-start',
) {
  const options = {
    targets: document.getElementsByClassName(className),
    offset: 100,
    ifIntoView() {
      // @ts-ignore
      if (!reverse) this.classList.remove(className)
      // @ts-ignore
      else this.classList.add(className)
    }
  }

  return new VisibilityObserver(options)
}

export { animateIfVisible }
export default animateIfVisible