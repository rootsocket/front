import { mount } from '@vue/test-utils'
import ButtonPressable from '@/components/ButtonPressable.vue'

describe('ButtonPressable', () => {
  test('primary works', () => {
    const wrapper = mount(ButtonPressable, {
      propsData: { variant: 'primary' },
    })
    expect(wrapper.vm).toBeTruthy()
  })
  test('outline works', () => {
    const wrapper = mount(ButtonPressable, {
      propsData: { variant: 'outline' },
    })
    expect(wrapper.vm).toBeTruthy()
  })
  test('default works', () => {
    const wrapper = mount(ButtonPressable, {
      propsData: { variant: 'none' },
    })
    expect(wrapper.vm).toBeTruthy()
  })
})
