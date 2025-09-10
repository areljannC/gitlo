import { vi, describe, beforeEach, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { DOMWrapper } from '@vue/test-utils';
import { Tag } from '#components';
import CreateBoardModal from './CreateBoardModal.vue';

describe('CreateBoardModal', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
		vi.resetAllMocks();
	});

	describe('props', () => {
		describe('open', () => {
			it('should render the modal when the `open` prop is `true`', async () => {
				await mountSuspended(CreateBoardModal, {
					props: { open: true }
				});
				const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
				expect(wrapper.exists()).toBe(true);
				expect(wrapper.findAll('input')).toHaveLength(4);
				expect(wrapper.findAll('button')).toHaveLength(2);
			});

			it('should not render the modal when the `open` prop is `false`', async () => {
				await mountSuspended(CreateBoardModal, {
					props: { open: false }
				});
				const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
				expect(wrapper.exists()).toBe(false);
			});
		});
	});

	describe('emits', () => {
		describe('close', () => {
			it('should emit `close` when the close button is clicked', async () => {
				const modal = await mountSuspended(CreateBoardModal, {
					props: { open: true }
				});
				const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
				expect(wrapper.exists()).toBe(true);
				expect(wrapper.findAll('input')).toHaveLength(4);
				expect(wrapper.findAll('button')).toHaveLength(2);

				const buttons = wrapper.findAll('button');
				const closeButton = buttons[0];

				await closeButton.trigger('click');
				expect(modal.emitted()).toHaveProperty('close');
				expect(modal.emitted().close).toHaveLength(1);
			});
		});

		describe('create', () => {
			it('should emit `create` when the create button is clicked', async () => {
				const modal = await mountSuspended(CreateBoardModal, {
					props: { open: true }
				});
				const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
				expect(wrapper.exists()).toBe(true);
				expect(wrapper.findAll('input')).toHaveLength(4);
				expect(wrapper.findAll('button')).toHaveLength(2);

				const boardNameInput = wrapper.find('input[name="name"]');
				expect(boardNameInput.exists()).toBe(true);
				expect((boardNameInput.element as HTMLInputElement).value).toBe('');

				boardNameInput.trigger('focus');
				await modal.vm.$nextTick();

				boardNameInput.setValue('Test Board');
				await modal.vm.$nextTick();
				expect((boardNameInput.element as HTMLInputElement).value).toBe('Test Board');

				boardNameInput.trigger('blur');
				await modal.vm.$nextTick();

				const boardDescriptionInput = wrapper.find('input[name="description"]');
				expect(boardDescriptionInput.exists()).toBe(true);
				expect((boardDescriptionInput.element as HTMLInputElement).value).toBe('');

				boardDescriptionInput.trigger('focus');
				await modal.vm.$nextTick();

				boardDescriptionInput.setValue('Test Board Description');
				await modal.vm.$nextTick();
				expect((boardDescriptionInput.element as HTMLInputElement).value).toBe('Test Board Description');

				boardDescriptionInput.trigger('blur');
				await modal.vm.$nextTick();

				const boardTagInput = wrapper.find('input[name="tag"]');
				expect(boardTagInput.exists()).toBe(true);
				expect((boardTagInput.element as HTMLInputElement).value).toBe('');

				boardTagInput.trigger('focus');
				await modal.vm.$nextTick();

				boardTagInput.setValue('TAG_1');
				await modal.vm.$nextTick();
				expect((boardTagInput.element as HTMLInputElement).value).toBe('TAG_1');

				boardTagInput.trigger('keydown', { key: 'Enter' });
				await modal.vm.$nextTick();
				expect((boardTagInput.element as HTMLInputElement).value).toBe('');
				expect(wrapper.findAllComponents(Tag)).toHaveLength(1);

				boardTagInput.trigger('focus');
				await modal.vm.$nextTick();

				boardTagInput.setValue('TAG_2');
				await modal.vm.$nextTick();
				expect((boardTagInput.element as HTMLInputElement).value).toBe('TAG_2');

				boardTagInput.trigger('keydown', { key: 'Enter' });
				await modal.vm.$nextTick();
				expect((boardTagInput.element as HTMLInputElement).value).toBe('');
				expect(wrapper.findAllComponents(Tag)).toHaveLength(2);

				const tags = wrapper.findAllComponents(Tag);
				expect(tags[0].text()).toContain('TAG_1');
				expect(tags[1].text()).toContain('TAG_2');

				const boardColumnsInput = wrapper.find('input[name="columns"]');
				expect(boardColumnsInput.exists()).toBe(true);
				expect((boardColumnsInput.element as HTMLInputElement).value).toBe('3');

				boardColumnsInput.trigger('focus');
				await modal.vm.$nextTick();

				boardColumnsInput.setValue('5');
				await modal.vm.$nextTick();
				expect((boardColumnsInput.element as HTMLInputElement).value).toBe('5');

				boardColumnsInput.trigger('blur');
				await modal.vm.$nextTick();

				const buttons = wrapper.findAll('button');
				expect(buttons).toHaveLength(4);
				const createButton = buttons[3];
				expect(createButton.exists()).toBe(true);

				// I have no clue why `.$nextTick` is needed to be called twice to submit the form... wtf.
				await createButton.trigger('click');
				await modal.vm.$nextTick();
				await modal.vm.$nextTick();
				expect(modal.emitted()).toHaveProperty('create');
			});
		});

		describe('input fields', () => {
			describe('tag', () => {
				it('should delete a tag when clicking its corresponding delete button', async () => {
					const modal = await mountSuspended(CreateBoardModal, {
						props: { open: true }
					});
					const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
					expect(wrapper.exists()).toBe(true);
					expect(wrapper.findAll('input')).toHaveLength(4);
					expect(wrapper.findAll('button')).toHaveLength(2);

					const boardTagInput = wrapper.find('input[name="tag"]');
					expect(boardTagInput.exists()).toBe(true);
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');

					boardTagInput.trigger('focus');
					await modal.vm.$nextTick();

					boardTagInput.setValue('TAG_1');
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('TAG_1');

					boardTagInput.trigger('keydown', { key: 'Enter' });
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');
					expect(wrapper.findAllComponents(Tag)).toHaveLength(1);

					boardTagInput.trigger('focus');
					await modal.vm.$nextTick();

					boardTagInput.setValue('TAG_2');
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('TAG_2');

					boardTagInput.trigger('keydown', { key: 'Enter' });
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');
					expect(wrapper.findAllComponents(Tag)).toHaveLength(2);

					const tags = wrapper.findAllComponents(Tag);
					expect(tags[0].text()).toContain('TAG_1');
					expect(tags[1].text()).toContain('TAG_2');

					const buttons = wrapper.findAll('button');
					expect(buttons).toHaveLength(4);

					const deleteTag1Button = buttons[0];
					await deleteTag1Button.trigger('click');
					await modal.vm.$nextTick();
					expect(wrapper.findAllComponents(Tag)).toHaveLength(1);
				});

				it('should not add a duplicate tag', async () => {
					const modal = await mountSuspended(CreateBoardModal, {
						props: { open: true }
					});
					const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
					expect(wrapper.exists()).toBe(true);
					expect(wrapper.findAll('input')).toHaveLength(4);
					expect(wrapper.findAll('button')).toHaveLength(2);

					const boardTagInput = wrapper.find('input[name="tag"]');
					expect(boardTagInput.exists()).toBe(true);
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');

					boardTagInput.trigger('focus');
					await modal.vm.$nextTick();

					boardTagInput.setValue('TAG_1');
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('TAG_1');

					boardTagInput.trigger('keydown', { key: 'Enter' });
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');
					expect(wrapper.findAllComponents(Tag)).toHaveLength(1);

					boardTagInput.trigger('focus');
					await modal.vm.$nextTick();

					boardTagInput.setValue('TAG_1');
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('TAG_1');

					boardTagInput.trigger('keydown', { key: 'Enter' });
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');
					expect(wrapper.findAllComponents(Tag)).toHaveLength(1);
				});

				it('should not add an empty tag', async () => {
					const modal = await mountSuspended(CreateBoardModal, {
						props: { open: true }
					});
					const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
					expect(wrapper.exists()).toBe(true);
					expect(wrapper.findAll('input')).toHaveLength(4);
					expect(wrapper.findAll('button')).toHaveLength(2);

					const boardTagInput = wrapper.find('input[name="tag"]');
					expect(boardTagInput.exists()).toBe(true);
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');

					boardTagInput.trigger('focus');
					await modal.vm.$nextTick();

					boardTagInput.setValue('TAG_1');
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('TAG_1');

					boardTagInput.trigger('keydown', { key: 'Enter' });
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');
					expect(wrapper.findAllComponents(Tag)).toHaveLength(1);

					boardTagInput.trigger('focus');
					await modal.vm.$nextTick();

					boardTagInput.setValue('');
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');

					boardTagInput.trigger('keydown', { key: 'Enter' });
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');
					expect(wrapper.findAllComponents(Tag)).toHaveLength(1);
				});

				it('should not add a tag with characters less than 2', async () => {
					const modal = await mountSuspended(CreateBoardModal, {
						props: { open: true }
					});
					const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
					expect(wrapper.exists()).toBe(true);
					expect(wrapper.findAll('input')).toHaveLength(4);
					expect(wrapper.findAll('button')).toHaveLength(2);

					const boardTagInput = wrapper.find('input[name="tag"]');
					expect(boardTagInput.exists()).toBe(true);
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');

					boardTagInput.trigger('focus');
					await modal.vm.$nextTick();

					boardTagInput.setValue('TAG_1');
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('TAG_1');

					boardTagInput.trigger('keydown', { key: 'Enter' });
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');
					expect(wrapper.findAllComponents(Tag)).toHaveLength(1);
					expect(wrapper.findAllComponents(Tag)[0].attributes('value')).toBeUndefined();

					boardTagInput.trigger('focus');
					await modal.vm.$nextTick();

					boardTagInput.setValue('T');
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('T');

					boardTagInput.trigger('keydown', { key: 'Enter' });
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('T');
					expect(wrapper.findAllComponents(Tag)).toHaveLength(1);

					boardTagInput.trigger('focus');
					await modal.vm.$nextTick();

					boardTagInput.setValue('');
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');

					boardTagInput.trigger('keydown', { key: 'Enter' });
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');
					expect(wrapper.findAllComponents(Tag)).toHaveLength(1);
				});

				it('should not add a tag with characters less than 16', async () => {
					const modal = await mountSuspended(CreateBoardModal, {
						props: { open: true }
					});
					const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
					expect(wrapper.exists()).toBe(true);
					expect(wrapper.findAll('input')).toHaveLength(4);
					expect(wrapper.findAll('button')).toHaveLength(2);

					const boardTagInput = wrapper.find('input[name="tag"]');
					expect(boardTagInput.exists()).toBe(true);
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');

					boardTagInput.trigger('focus');
					await modal.vm.$nextTick();

					boardTagInput.setValue('TAG_1');
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('TAG_1');

					boardTagInput.trigger('keydown', { key: 'Enter' });
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');
					expect(wrapper.findAllComponents(Tag)).toHaveLength(1);
					expect(wrapper.findAllComponents(Tag)[0].attributes('value')).toBeUndefined();

					boardTagInput.trigger('focus');
					await modal.vm.$nextTick();

					boardTagInput.setValue('Tsfjsljfsdfsdlji3i3isldkfjdsk3k3jsdflkjdsj33j3jsldkfjsdj3jsdf');
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('Tsfjsljfsdfsdlji3i3isldkfjdsk3k3jsdflkjdsj33j3jsldkfjsdj3jsdf');

					boardTagInput.trigger('keydown', { key: 'Enter' });
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('Tsfjsljfsdfsdlji3i3isldkfjdsk3k3jsdflkjdsj33j3jsldkfjsdj3jsdf');
					expect(wrapper.findAllComponents(Tag)).toHaveLength(1);

					boardTagInput.trigger('focus');
					await modal.vm.$nextTick();

					boardTagInput.setValue('');
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');

					boardTagInput.trigger('keydown', { key: 'Enter' });
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');
					expect(wrapper.findAllComponents(Tag)).toHaveLength(1);
				});

				it('should not add a tag if `Enter` key is not pressed', async () => {
					const modal = await mountSuspended(CreateBoardModal, {
						props: { open: true }
					});
					const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
					expect(wrapper.exists()).toBe(true);
					expect(wrapper.findAll('input')).toHaveLength(4);
					expect(wrapper.findAll('button')).toHaveLength(2);

					const boardTagInput = wrapper.find('input[name="tag"]');
					expect(boardTagInput.exists()).toBe(true);
					expect((boardTagInput.element as HTMLInputElement).value).toBe('');

					boardTagInput.trigger('focus');
					await modal.vm.$nextTick();

					boardTagInput.setValue('TAG_1');
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('TAG_1');

					boardTagInput.trigger('keydown', { key: 'X' });
					await modal.vm.$nextTick();
					expect((boardTagInput.element as HTMLInputElement).value).toBe('TAG_1');
					expect(wrapper.findAllComponents(Tag)).toHaveLength(0);
				});
			});
		});
	});
});
