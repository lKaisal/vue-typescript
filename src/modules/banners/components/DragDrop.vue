<template lang="pug">
  include ../../../tools/bemto.pug

  +b.drag-drop
    +e.TRANSITION-GROUP.container(tag="div" :class="{ 'is-filled': !!file }")
      +e.loaders(v-show="!file" key="loaders")
        +e.I.drop-plus.el-icon-plus
        +e.size(v-html="'1122x670'")
        +e.drop(@drop.prevent="onDropImg()")
        +e.INPUT.input-img(ref="fileinput" type="file" @input="onInputImg")
      +e.img-preview._loading(v-if="!imgLoaded && imgUrl" key="loading")
      +e.img(v-show="file" @mouseenter.self="dropDeleteIsShown=true" @mouseleave="dropDeleteIsShown=false" @click.stop="!isTouchDevice && removeImg()" key="img")
        transition(mode="in-out")
          IMG(v-if="imgLoaded" :src="imgUrl" :class="{ 'is-faded': dropDeleteIsShown }" class="drag-drop__img-preview")
        +e.I.drop-delete.el-icon-delete-solid(v-show="dropDeleteIsShown" @click="isTouchDevice && dropDeleteIsShown && removeImg()" )
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch, Mixins } from 'vue-property-decorator'
import { bannersMapper } from '../module/store'
import { systemMapper } from '@/modules/system/module/store'
import preloadImages from '@/mixins/preloadImages'

const BannersMapper = Vue.extend({
  computed: {
    ...bannersMapper.mapGetters(['formFile', 'bannerById'])
  },
  methods: {
    ...bannersMapper.mapActions(['updateField'])
  }
})
const SystemMappers = Vue.extend({
  computed: {
    ...systemMapper.mapGetters(['isTouchDevice'])
  }
})

@Component({
  components: {
  }
})

export default class DragDrop extends Mixins(BannersMapper, SystemMappers) {
  imgUrl: any = ''
  dropDeleteIsShown: boolean = false
  imgLoaded: boolean = false

  get fileField() { return this.formFile }
  get file() { return this.fileField.value }
  set file(value) { this.updateFile(value) }
  get banner() { return this.bannerById(Number(this.$route.params.id)) }
  get bannerImgUrl() { return this.banner && this.banner.bannerImageUrl }

  @Ref() readonly fileinput!: HTMLInputElement

  @Watch('file', { immediate: true })
  onFileChange(val) {
    if (val) this.getImagePreviews()
  }

  created() {
    if (this.imgUrl) {
      preloadImages(this.imgUrl)
        .then(() => this.imgLoaded = true)
    }
  }

  @Watch('imgUrl')
  onImgUrlChange(val) {
    try {
      if (val) {
        this.imgLoaded = false
        preloadImages(this.imgUrl)
          .then(() => this.imgLoaded = true)
      }
    } catch {}
  }

  // METHODS
  updateFile(value) { return this.updateField({name: 'file', value}) }
  onDropImg(evt: DragEvent) {
    this.file = evt.dataTransfer && evt.dataTransfer.files[0]
  }
  onInputImg(evt: InputEvent) {
    const target = <HTMLInputElement>evt.target
    this.file = target.files && target.files[0]
  }
  getImagePreviews() {
    // @ts-ignore
    if (this.file.type) {
      let reader = new FileReader();
      reader.addEventListener('load', () => this.imgUrl = reader.result, false);
      // @ts-ignore
      reader.readAsDataURL(this.file);
    } else {
      this.imgUrl = this.file
    }
  }
  removeImg() {
    this.updateFile(null)
    this.fileinput.value = ''
    this.imgUrl = null
    this.dropDeleteIsShown = false
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.drag-drop

  &__container
    position relative
    width 100%
    padding-bottom 59%
    border 1px dashed $cInfo
    border-radius 6px
    background-color white
    overflow hidden
    transition(border-color)
    &:hover
      border-color $cBrand
    &.is-filled
      border 1px solid $cBrand
    .is-invalid &
      border-color $cDanger
      animation pulsate ease-in-out .5s both

  &__loaders
  &__img
    transition(opacity)
    &.v-enter
    &.v-leave-to
      opacity 0

  &__loaders
    position absolute
    width 100%
    height 100%
    display flex
    // flex-direction column
    justify-content center
    align-items center

  &__size
    position absolute
    transform translateY(25px)
    color $cSecondaryText
    fontLight()
    transition(color)
    .is-invalid &
      color $cDanger

  &__input-img
    opacity 0
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    width 100%
    height 100%
    cursor pointer

  &__img
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    overflow hidden
    display flex
    justify-content center
    align-items center
    cursor pointer

  &__img-preview
    transition()
    &.is-faded
      opacity .5
    &.v-enter
    &.v-leave-to
      opacity 0
    &.v-enter-active
    &.v-leave-active
      transition-duration $tVerySlow
    &_loading
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      transform none
      animation placeholderShimmer 1.8s forwards linear infinite
      background #f6f7f8
      background linear-gradient(to right, #fafafa 8%, #f4f4f4 38%, #fafafa 54%)
      background-size 200% 100%

  &__drop-plus
  &__drop-delete
    font-size 28px
    color $cInfo
    transition(color\, transform)

  &__drop-plus
    .drag-drop__container:hover &
      color $cBrand
      transform scale(.75)
      transform-origin center
      .is-invalid &
        color $cDanger
    .is-invalid &
      color $cDanger

  &__drop-delete
    color $cPrimaryText
    z-index 1
    position absolute
</style>