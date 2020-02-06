import Vue from 'vue'
import { Mixin } from 'vue-mixin-decorator'
import { RequestStatus, MsgBoxContent, Button } from '../models'

@Mixin
export default class msgBoxTools extends Vue {
  msgBoxIsShown: boolean = false
  requestStatus: RequestStatus = 'failFetchList'
  msgBoxContents: { [key in RequestStatus]: MsgBoxContent } = {
    successFetchList: {
      title: 'Готово!',
      msg: 'Данные успешно загружены',
      firstBtn: 'Закрыть'
    },
    failFetchList: {
      title: 'Ошибка!',
      msg: 'Не удалось получить ответ от сервера',
      firstBtn: 'Повторить попытку',
    },
    successFetchBanner: {
      title: 'Готово!',
      msg: 'Данные успешно загружены',
      firstBtn: 'Закрыть'
    },
    failFetchBanner: {
      title: 'Данные не найдены',
      msg: 'Вероятно баннер был удален ранее',
      firstBtn: 'Вернуться к списку',
    },
    successCreate: {
      title: 'Готово!',
      msg: 'Данные успешно сохранены',
      firstBtn: 'Отредактировать баннер',
      secondBtn: 'Вернуться к списку'
    },
    failCreate: {
      title: 'Ошибка при отправке',
      msg: 'Не удалось отправить данные',
      firstBtn: 'Отправить повторно',
      secondBtn: 'Отменить'
    },
    successEdit: {
      title: 'Готово!',
      msg: 'Данные успешно сохранены',
      firstBtn: 'Продолжить редактирование',
      secondBtn: 'Вернуться к списку'
    },
    failEdit: {
      title: 'Ошибка при отправке',
      msg: 'Не удалось отправить данные',
      firstBtn: 'Отправить повторно',
      secondBtn: 'Отменить'
    },
    successDelete: {
      title: 'Готово!',
      msg: 'Данные успешно удалены',
      firstBtn: 'Вернуться к списку',
    },
    failDelete: {
      title: 'Ошибка при удалении',
      msg: 'Возможно информация уже была удалена',
      firstBtn: 'Повторить попытку',
      secondBtn: 'Отменить'
    },
    beforeDelete: {
      title: 'Вы уверены?',
      msg: 'Данное действие нельзя отменить',
      firstBtn: 'Подтвердить',
      secondBtn: 'Отмена'
    },
  }

  get msgBoxContent() { return this.msgBoxContents[this.requestStatus] }

  created() {
    document.addEventListener('keydown', this.keydownHandler)
  }

  beforeDestroy() {
    document.body.classList.remove('modal-open')
    document.removeEventListener('keydown', this.keydownHandler)
  }

  keydownHandler(evt: KeyboardEvent) {
    if (evt.key === 'Escape' && this.msgBoxIsShown) this.closeMsgBox()
  }
  openMsgBox() {
    document.body.classList.add('modal-open')
    this.msgBoxIsShown = true
  }
  closeMsgBox() {
    document.body.classList.remove('modal-open')
    this.msgBoxIsShown = false
  }
}