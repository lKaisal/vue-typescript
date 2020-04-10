<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-banner
    +e.container(@mouseenter="cardIsHovered=true" @mouseleave="cardIsHovered=false"
      :class="{ 'is-hovered': cardIsHovered && editIconsShown, 'is-large-padding-top': isTouchDevice }")
      transition
        +e.icons(v-show="editIconsShown && (cardIsHovered || isTouchDevice)" :class="{ 'is-small': isTouchDevice }")
          +e.icon._edit(v-if="banner" @click="onEditClick" @mouseenter="editHovered=true" @mouseleave="editHovered=false" :class="{ 'is-active': !deleteHovered }")
            i(class="el-icon-edit")
          +e.icon._delete(v-if="banner && (banner.isActive || banner.delayStart)" @click="onDeleteClick" @mouseenter="deleteHovered=true" @mouseleave="deleteHovered=false" :class="{ 'is-active': !editHovered }")
            i(class="el-icon-delete")
          +e.icon._add(v-if="!banner" @click="onCreateClick")
            i(class="el-icon-plus")
      +e.img-wrapper(:class="{ 'is-small': isSmallImg }")
        transition(mode="in-out")
          IMG.item-banner__img(v-if="banner && imgLoaded" :src="banner.bannerImageUrl")
          +e.img.bg-empty(v-else :class="{ 'item-banner__img_loading': imgIsLoading }")
      +e.info(v-if="banner")
        +e.info-item(v-if="banner.title")
          +e.title Имя баннера:&nbsp;<span class="item-banner__text">{{ banner.title }}</span>
        +e.info-item(v-if="banner.position && (banner.isActive || banner.delayStart)")
          +e.title Порядок вывода:&nbsp;<span class="item-banner__text">{{ Math.abs(banner.position) }}</span>
        +e.info-item(v-if="banner.appLink")
          +e.title Ссылка:&nbsp;<span class="item-banner__text">{{ banner.appLink }}</span>
        +e.info-item(v-if="banner.updatedAt")
          +e.title Обновлен:&nbsp;<span class="item-banner__text">{{ banner.updatedAt }}</span>
        +e.info-item(v-if="banner.createdAt")
          +e.title Создан:&nbsp;<span class="item-banner__text">{{ banner.createdAt }}</span>
        +e.info-item
          +e.title(v-html="activeFromToText")
          //- +e.title Действует до:
          //- +e.text {{ banner.activeFrom  }}
      +e.info(v-else)
        +e.info-item._empty.bg-empty(v-for="n in 4")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { Banner } from '../models'
import preloadImages from '@/mixins/preloadImages'
import sleep from '@/mixins/sleep'
import { VisibilityObserver, VisibilityObserverOptions } from '@/mixins/VisibilityObserver'
import { uiMapper } from '@/modules/ui/module/store'

const UiMappers = Vue.extend({
  computed: {
    ...uiMapper.mapGetters(['isTouchDevice'])
  }
})

@Component({
})

export default class ItemBanners extends Mixins(UiMappers) {
  @Prop() banner: Banner
  @Prop({ default: true }) editIconsShown: boolean
  @Prop() isSmallImg: boolean

  imgIsLoading: boolean = false
  imgLoaded: boolean = false
  editHovered: boolean = false
  deleteHovered: boolean = false
  cardIsHovered: boolean = false
  observer = null
  count: number = 0

  get isActive() { return this.banner.isActive }
  get activeFromToText() {
    if (this.isActive) {
      if (!this.banner.activeTo) return `Действует:&nbsp;<span class="item-banner__text">неограниченно</span>`
      else return `Действует до:&nbsp;<span class="item-banner__text">${this.banner.activeTo}</span>`
    } else {
      if (this.banner.activeFrom && this.banner.activeTo) return `Действует: <span class="item-banner__text">${this.banner.activeFrom}&nbsp;&ndash;&nbsp;${this.banner.activeTo}</span>`
      else if (!this.banner.activeFrom && this.banner.activeTo) return `Действует до:&nbsp;<span class="item-banner__text">${this.banner.activeTo}</span>`
      else if (this.banner.activeFrom && !this.banner.activeTo) return `Действует c:&nbsp;<span class="item-banner__text">${this.banner.activeFrom}</span>`
    }
  }
  get moduleLink() { return this.$route && this.$route.matched && this.$route.matched[0].path.slice(1) }

  @Watch('imgLoaded', { immediate: true })
  onImgLoaded(val) {
    if (!this.banner) return
    console.log('imgLoaded of ' + this.banner.id + ': ' + val)
  }

  async mounted() {
    await this.$nextTick()
    this.count = 0
    this.imgLoaded = false
    this.initObserver()
  }

  goToPageCreate() { this.$router.push({ path: `/${this.moduleLink}/create` }) }
  onEditClick() { this.$emit('editClicked') }
  onDeleteClick() { this.$emit('deleteClicked') }
  onCreateClick() { this.$emit('createClicked') }
  preloadImage() {
    if (!this.banner) return
    console.log('start preload: ' + this.banner.id)

    preloadImages(this.banner.bannerImageUrl)
      .then(async () => {
        console.log('preload success: ' + this.banner.id)
        this.imgLoaded = true
      })
      .catch(() => {
        this.preloadImage()
        console.log('preload fail: ' + this.banner.id)
      })
      .finally(() => {
        this.count++
        console.log(this.imgLoaded)
      })
  }
  initObserver() {
    const targets = this.$el
    const options = {
      targets,
      offset: 0,
      ifIntoView: () => this.preloadImage()
    }

    this.observer = new VisibilityObserver(options)
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.item-banner

  &__container
    position relative
    // display flex
    // justify-content center
    // flex-wrap wrap
    width 100%
    height 100%
    padding 50px 50px 50px
    border 1px solid rgba(0,0,0,.125)
    border-radius .25rem
    background-color white
    transition(border-color)
    overflow hidden
    html.mobile &
    html.tablet &
      padding-top 63px
    &.is-hovered
      border-color $cBrand
    .sortable-chosen &
      border-color $cBrand

  &__icons
    z-index 2
    position absolute
    // top 20px
    top 0
    bottom 0
    right 0
    left 0
    width 100%
    padding 15px
    border-radius .25rem
    // top -50px
    // right -25px
    display flex
    justify-content center
    transition(opacity\, transform)
    &.v-enter
    &.v-leave-to
    .sortable-chosen &
      opacity 0
    &.v-enter-active
    &.v-leave-active
      pointer-events none
      transition-duration $tFast
    &:before
      ghost()
      background white
      opacity .75
    &.is-small
      bottom auto
      left auto
      width auto
      &:before
        display none

  &__icon
    z-index 5
    margin-top 30%
    margin-bottom 65%
    width 30%
    display flex
    justify-content center
    align-items center
    cursor pointer
    transition(background-color)
    >>> i
      font-size 60px
      color $cBrand
      opacity .75
      transition(color\, opacity\, transform)
    &:not(:last-child)
      margin-right 15px
    &_edit
      &.is-active
        >>> i
          color $cBrand
          opacity 1
      &:hover
        >>> i
          transform scale(1.25) translate3d(0,0,0)
          opacity 1
    &_delete
      border-color $cDanger
      >>> i
        color $cDanger
      &.is-active
        >>> i
          color $cDanger
          opacity 1
      &:hover
        >>> i
          transform scale(1.25) translate3d(0,0,0)
          opacity 1
    &_add
      opacity 1
      &:hover
        >>> i
          transform scale(1.25) translate3d(0,0,0)
          opacity 1
    .is-small &
      margin 0
      width 100%
      padding 5px
      border 1px solid $cBrand
      border-radius 50%
      &_delete
        border-color $cDanger
      &:not(:last-child)
        margin-right 5px
      >>> i
        font-size 18px
        opacity 1
        transform scale(1)

  &__img-wrapper
    position relative
    width 100%
    margin-bottom 50px
    padding-top 59.7%
    overflow hidden
    align-self flex-start
    transition(transform)
    +xs()
      margin-bottom 30px
    &.is-small
      margin-bottom 30px
      +gt-sm()
        margin-right auto
        margin-left auto
        width 75%
        padding-top calc(75% * .597)

  &__img
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    max-width 100%
    max-height none
    width 100%
    transition(opacity)
    &.v-enter
    &.v-leave-to
      opacity 0
    &.bg-empty
      z-index 1
      top 0
      right 0
      bottom 0
      left 0
      transform none
    &_loading
      animation placeholderShimmer 1.8s forwards linear infinite
      background-size 200% 100%

  &__info
    width 100%
    line-height 1.25
    font-size 16px
    +xs()
      font-size 14px

  &__info-item
    margin 0 auto
    text-align center
    white-space nowrap
    overflow hidden
    +xs()
      justify-content flex-start
    &:not(:last-child)
      +xl()
        margin-bottom 15px
      +lt-xl()
        margin-bottom 10px
    &_empty
      width 75%
      height 20px
      &:first-child
      &:last-child
        width 50%

  &__title
    fontMedium()
    >>> span
      fontLight()

  &__text
    fontLight()
</style>
