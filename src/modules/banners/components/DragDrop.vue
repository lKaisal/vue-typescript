<template lang="pug">
  include ../../../tools/bemto.pug

  +b.drag-drop
    +e.TRANSITION-GROUP.container(tag="div" :class="{ 'is-filled': !!file }")
      +e.loaders(v-show="!file" key="loaders")
        i(class="el-icon-plus drag-drop__drop-plus")
        +e.drop(@drop.prevent="onDropImg")
        +e.INPUT.input-img(ref="fileinput" type="file" @input="onInputImg")
      +e.img(v-show="file" @mouseenter.self="dropDeleteIsShown=true" @mouseleave="dropDeleteIsShown=false" @click="removeImg" key="img")
        IMG(:src="imgUrl" :class="{ 'is-faded': dropDeleteIsShown }" class="drag-drop__img-preview")
        i(v-show="dropDeleteIsShown" class="el-icon-delete-solid drag-drop__drop-delete")
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { bannersMapper } from '../module/store'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapGetters([
      'formFile'
    ])
  },
  methods: {
    ...bannersMapper.mapMutations([
      'updateField'
    ])
  }
})

@Component({
  components: {
  }
})

export default class DrapDrop extends Mappers {
  imgUrl: string | ArrayBuffer | null = ''
  dropDeleteIsShown: boolean = false

  get fileField() { return this.formFile }

  get file() { return this.fileField.value }
  set file(value) { this.updateFile(value) }

  @Ref() readonly fileinput!: HTMLInputElement

  // METHODS
  updateFile(value) { return this.updateField({name: 'file', value}) }
  onDropImg(evt: DragEvent) {
    this.file = evt.dataTransfer && evt.dataTransfer.files[0]

    if (this.file) this.getImagePreviews();
  }
  onInputImg(evt: InputEvent) {
    const target = <HTMLInputElement>evt.target
    this.file = target.files && target.files[0]

    if (this.file) this.getImagePreviews()
  }
  getImagePreviews(){
    let reader = new FileReader();
    reader.addEventListener('load', () => this.imgUrl = reader.result, false);
    // @ts-ignore
    reader.readAsDataURL(this.file);
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
    width 320px
    height 180px
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

  &__loaders
  &__img
    transition(opacity)
    &.v-enter
    &.v-leave-to
      opacity 0

  &__loaders
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center

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
    z-index 1000
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