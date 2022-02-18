import { mount } from '@vue/test-utils'
import TextLabel from '@/components/TextLabel.vue'

describe('TextLabel', () => {
  test('works', () => {
    const wrapper = mount(TextLabel)
    expect(wrapper.vm).toBeTruthy()
  })
})
