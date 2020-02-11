<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-banner
    +e.container(@mouseenter="cardIsHovered=true" @mouseleave="cardIsHovered=false")
      transition
        +e.icons(v-show="editIconsShown && cardIsHovered")
          +e.icon._edit(@click="onEditClick" @mouseenter="editHovered=true" @mouseleave="editHovered=false" :class="{ 'is-active': !deleteHovered }")
            i(class="el-icon-edit")
          +e.icon._delete(v-if="banner.isActive" @click="onDeleteClick" @mouseenter="deleteHovered=true" @mouseleave="deleteHovered=false" :class="{ 'is-active': !editHovered }")
            i(class="el-icon-delete")
      +e.img-wrapper
        transition(mode="in-out")
          IMG.item-banner__img(v-if="imgLoaded" :src="banner.bannerImageUrl")
          +e.img._loading(v-else)
      +e.info
        +e.info-item(v-if="banner.appLink")
          +e.title Ссылка:&nbsp;<span class="item-banner__text">{{ banner.appLink }}</span>
        +e.info-item(v-if="banner.sortCalculated && banner.isActive")
          +e.title Порядок вывода:&nbsp;<span class="item-banner__text">{{ banner.sortCalculated }}</span>
        +e.info-item(v-if="banner.createdAt")
          +e.title Создан:&nbsp;<span class="item-banner__text">{{ banner.createdAt }}</span>
        //- +e.info-item(v-if="banner.activeFrom || banner.activeTo")
          +e.title Срок действия: 
          +e.text {{ banner.activeFrom + '&emsp;&mdash;&emsp;' + banner.activeTo }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Banner } from '../models'
import preloadImages from '@/mixins/preloadImages'
import sleep from '@/mixins/sleep'
import { VisibilityObserver, VisibilityObserverOptions } from '@/mixins/VisibilityObserver'

@Component({
})

export default class ItemBanners extends Vue {
  @Prop() banner: Banner
  @Prop({ default: true }) editIconsShown: boolean
  imgLoaded: boolean = false
  editHovered: boolean = false
  deleteHovered: boolean = false
  cardIsHovered: boolean = false
  observer = null

  mounted() {
    this.initObserver()
  }

  initObserver() {
    const targets = this.$el
    const options = {
      targets,
      offset: 50,
      ifIntoView: () => this.preloadImage()
    }

    this.observer = new VisibilityObserver(options)
  }
  onEditClick() {
    this.$router.push({ path: `/banners/edit/${this.banner.id.toString()}` })
  }
  onDeleteClick() {
    this.$emit('delete', this.banner.id)
  }
  preloadImage() {
    preloadImages(this.banner.bannerImageUrl)
      .then(async () => {
        // await sleep(1000)
        this.imgLoaded = true
      })
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.item-banner

  &__container
    position relative
    display flex
    justify-content center
    flex-wrap wrap
    width 100%
    height 100%
    padding 50px 50px 50px
    border 1px solid rgba(0,0,0,.125)
    border-radius .25rem
    background-color white
    transition(border-color)
    overflow hidden
    &:hover
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
      opacity 0
      // transform translateX(-100%)
    &.v-leave-to
      opacity 0
      // transform translateX(100%)
    &.v-enter-active
    &.v-leave-active
      pointer-events none
      transition-duration $tFast
    // .item-banner__container:hover &
    //   opacity 1
    //   transform none
    &:before
      ghost()
      background white
      opacity .75

  &__icon
    z-index 5
    // padding 7px
    // margin -7px
    margin-top 20%
    margin-bottom 45%
    width 30%
    display flex
    justify-content center
    align-items center
    // border-radius 50%
    // border 1px solid $cSecondaryText
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
      // border 1px solid $cBrand
      &.is-active
        // border-color $cBrand
        >>> i
          color $cBrand
          opacity 1
      &:hover
        // background-color $cBrand
        >>> i
          // color white
          transform scale(1.25) translate3d(0,0,0)
          opacity 1
          // color $cBrand
    &_delete
      // border 1px solid $cDanger
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
        // background-color $cDanger

  &__img-wrapper
    position relative
    width 100%
    padding-top 59.7%
    // height 50%
    overflow hidden
    margin-bottom 50px
    align-self flex-start
    transition(transform)
    .item-banner__container:hover &
      // transform scale(.9)

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
    &_loading
      z-index 1
      top 0
      right 0
      bottom 0
      left 0
      transform none
      animation placeholderShimmer 1.8s forwards linear infinite
      background #f6f7f8
      background linear-gradient(to right, #fafafa 8%, #f4f4f4 38%, #fafafa 54%)
      background-size 200% 100%

  &__info
    line-height 1.25
    font-size 16px
    // +gt-md()
    //   font-size 16px
    // +lt-md()
    //   font-size 14px

  &__info-item
    // display flex
    // justify-content center
    text-align center
    white-space nowrap
    +xs()
      justify-content flex-start
    &:not(:last-child)
      +xl()
        margin-bottom 15px
      +lt-xl()
        margin-bottom 10px

  &__title
    fontMedium()

  &__text
    fontLight()
</style>
