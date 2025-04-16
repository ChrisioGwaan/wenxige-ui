import { ref, watch } from "vue"

/** Project title */
const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE ?? "Wenxige"

/** Dynamic title */
const dynamicTitle = ref<string>("")

/** Title configuration */
const setTitle = (title?: string) => {
  dynamicTitle.value = title ? `${VITE_APP_TITLE} | ${title}` : VITE_APP_TITLE
}

/** Title change listening */
watch(dynamicTitle, (value, oldValue) => {
  if (document && value !== oldValue) {
    document.title = value
  }
})

export function useTitle() {
  return { setTitle }
}
