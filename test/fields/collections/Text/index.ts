import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types'

import { AfterInput } from './AfterInput'
import { BeforeInput } from './BeforeInput'
import CustomError from './CustomError'
import CustomLabel from './CustomLabel'
import { defaultText, textFieldsSlug } from './shared'

const TextFields: CollectionConfig = {
  admin: {
    useAsTitle: 'text',
  },
  defaultSort: 'id',
  fields: [
    {
      name: 'text',
      required: true,
      type: 'text',
    },
    {
      name: 'localizedText',
      localized: true,
      type: 'text',
    },
    {
      name: 'i18nText',
      admin: {
        description: {
          en: 'en description',
          es: 'es description',
        },
        placeholder: {
          en: 'en placeholder',
          es: 'es placeholder',
        },
      },
      label: {
        en: 'Text en',
        es: 'Text es',
      },
      type: 'text',
    },
    {
      name: 'defaultFunction',
      defaultValue: () => defaultText,
      type: 'text',
    },
    {
      name: 'defaultAsync',
      defaultValue: async (): Promise<string> => {
        return new Promise((resolve) =>
          setTimeout(() => {
            resolve(defaultText)
          }, 1),
        )
      },
      type: 'text',
    },
    {
      name: 'overrideLength',
      label: 'Override the 40k text length default',
      maxLength: 50000,
      type: 'text',
    },
    {
      name: 'fieldWithDefaultValue',
      defaultValue: async () => {
        const defaultValue = new Promise((resolve) => setTimeout(() => resolve('some-value'), 1000))

        return defaultValue
      },
      type: 'text',
    },
    {
      name: 'dependentOnFieldWithDefaultValue',
      hooks: {
        beforeChange: [
          ({ data }) => {
            return data?.fieldWithDefaultValue || ''
          },
        ],
      },
      type: 'text',
    },
    {
      name: 'customLabel',
      admin: {
        components: {
          Label: CustomLabel,
        },
      },
      type: 'text',
    },
    {
      name: 'customError',
      admin: {
        components: {
          Error: CustomError,
        },
      },
      minLength: 3,
      type: 'text',
    },
    {
      name: 'beforeAndAfterInput',
      admin: {
        components: {
          afterInput: [AfterInput],
          beforeInput: [BeforeInput],
        },
      },
      type: 'text',
    },
    {
      name: 'hasMany',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'validatesHasMany',
      type: 'text',
      hasMany: true,
      validate: (value: string[]) => {
        if (value && !Array.isArray(value)) {
          return 'value should be an array'
        }
        return true
      },
    },
    // {
    //   name: 'localizedHasMany',
    //   type: 'text',
    //   hasMany: true,
    //   localized: true,
    // },
    // {
    //   name: 'withMinRows',
    //   type: 'text',
    //   hasMany: true,
    //   minRows: 2,
    // },
  ],
  slug: textFieldsSlug,
}

export default TextFields
