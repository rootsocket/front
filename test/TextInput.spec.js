import { mount } from '@vue/test-utils'
import TextInput from '@/components/TextInput.vue'

describe('TextInput', () => {
  test('works', () => {
    const wrapper = mount(TextInput)
    expect(wrapper.vm).toBeTruthy()
  })
})
