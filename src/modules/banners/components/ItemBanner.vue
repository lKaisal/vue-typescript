<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-banner
    +e.container
      +e.icons(v-if="editIconsShown")
        +e.icon(@click="onEditClick")
          i(class="el-icon-edit")
        +e.icon(@click="onDeleteClick")
          i(class="el-icon-delete")
      +e.img-wrapper
        transition
          IMG.item-banner__img(v-if="imgLoaded" :src="banner.bannerImageUrl")
          +e.img._loading(v-else)
      +e.info
        +e.info-item(v-if="banner.appLink")
          +e.title Ссылка:&nbsp;<span class="item-banner__text">{{ banner.appLink }}</span>
        +e.info-item(v-if="banner.sortCalculated")
          +e.title Порядок вывода:&nbsp;<span class="item-banner__text">{{ banner.sortCalculated }}</span>
        +e.info-item(v-if="banner.sort")
          +e.title Порядок вывода:&nbsp;<span class="item-banner__text">{{ banner.sort }}</span>
        +e.info-item
          +e.title Отображать в приложении:&nbsp;<span class="item-banner__text">{{ banner.isActive ? 'Да' : 'Нет' }}</span>
        +e.info-item(v-if="banner.activeFrom || banner.activeTo")
          +e.title Срок действия: 
          +e.text {{ banner.activeFrom + '&emsp;&mdash;&emsp;' + banner.activeTo }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Banner } from '../models'
import preloadImages from '@/mixins/preloadImages'

@Component({
})

export default class ItemBanners extends Vue {
  @Prop() banner: Banner
  @Prop({ default: true }) editIconsShown: boolean
  imgLoaded: boolean = false

  created() {
    preloadImages(this.banner.bannerImageUrl)
      .then(() => this.imgLoaded = true)
  }

  onEditClick() {
    this.$router.push({ path: `/banners/edit/${this.banner.id.toString()}` })
  }
  onDeleteClick() {
    this.$emit('delete', this.banner.id)
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

  &__icons
    position absolute
    top -50px
    right -25px
    display flex

  &__icon
    padding 7px
    margin -7px
    display flex
    justify-content space-between
    align-items center
    border-radius 50%
    cursor pointer
    transition(background-color)
    >>> i
      font-size 20px
      transition(color)
    &:not(:last-child)
      margin-right 15px
    &:first-child
      border 1px solid $cBrand
      >>> i
        color $cBrand
      &:hover
        background-color $cBrand
        >>> i
          color white
    &:last-child
      border 1px solid $cDanger
      >>> i
        color $cDanger
      &:hover
        background-color $cDanger
        >>> i
          color white

  &__img-wrapper
    position relative
    width 100%
    padding-top 59.7%
    // height 50%
    overflow hidden
    margin-bottom 50px

  &__img
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    max-width 100%
    max-height none
    transition(opacity)
    &.v-enter
    &.v-leave-to
      opacity 0
    &_loading
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
    align-self flex-end
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
