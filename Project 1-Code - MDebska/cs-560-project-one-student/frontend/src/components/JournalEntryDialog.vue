<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { JournalEntry, NewJournalEntry } from '@/types'

const props = defineProps<{
  modelValue: boolean
  bookId: number
  totalPages: number
  entry?: JournalEntry | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [entry: NewJournalEntry]
  update: [id: number, entry: Partial<NewJournalEntry>]
}>()

const dialog = ref(props.modelValue)
const pageNumber = ref<number | null>(null)
const entryDate = ref<string>(new Date().toISOString().split('T')[0] || '')
const thoughts = ref('')
const valid = ref(false)

const isEditMode = computed(() => !!props.entry)
const dialogTitle = computed(() => isEditMode.value ? 'Edit Journal Entry' : 'Add Journal Entry')
const saveButtonText = computed(() => isEditMode.value ? 'Save Changes' : 'Add Entry')

const rules = {
  required: (v: string | number | null) => !!v || 'Required',
  positive: (v: number | null) => (v !== null && v > 0) || 'Must be greater than 0',
  maxPages: (v: number | null) =>
    v === null || v <= props.totalPages || `Cannot exceed ${props.totalPages} pages`,
}

watch(
  () => props.modelValue,
  (val) => {
    dialog.value = val
    if (val && props.entry) {
      // Pre-fill form with existing entry data
      pageNumber.value = props.entry.page_number
      entryDate.value = props.entry.entry_date
      thoughts.value = props.entry.thoughts
    }
  },
)

watch(dialog, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    resetForm()
  }
})

function resetForm() {
  pageNumber.value = null
  entryDate.value = new Date().toISOString().split('T')[0] || ''
  thoughts.value = ''
}

function handleSave() {
  if (!valid.value || pageNumber.value === null) return

  if (isEditMode.value && props.entry) {
    emit('update', props.entry.id, {
      page_number: pageNumber.value,
      entry_date: entryDate.value,
      thoughts: thoughts.value,
    })
  } else {
    emit('save', {
      book_id: props.bookId,
      page_number: pageNumber.value,
      entry_date: entryDate.value,
      thoughts: thoughts.value,
    })
  }

  dialog.value = false
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            v-model.number="pageNumber"
            label="Page Number"
            type="number"
            :rules="[rules.required, rules.positive, rules.maxPages]"
            :hint="`Max: ${totalPages} pages`"
            persistent-hint
            required
          />
          <v-text-field
            v-model="entryDate"
            label="Date"
            type="date"
            :rules="[rules.required]"
            required
          />
          <v-textarea
            v-model="thoughts"
            label="Your Thoughts (optional)"
            rows="4"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn color="primary" :disabled="!valid" @click="handleSave">{{ saveButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
