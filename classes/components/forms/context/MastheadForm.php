<?php
/**
 * @file classes/components/form/context/MastheadForm.php
 *
 * Copyright (c) 2014-2021 Simon Fraser University
 * Copyright (c) 2000-2021 John Willinsky
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @class MastheadForm
 *
 * @ingroup classes_controllers_form
 *
 * @brief Add OJS-specific fields to the masthead form.
 */

namespace APP\components\forms\context;

use PKP\components\forms\context\PKPMastheadForm;
use PKP\components\forms\FieldText;
use PKP\components\forms\FieldUpload;

class MastheadForm extends PKPMastheadForm
{
    /**
     * @param string $action URL to submit the form to
     * @param array $locales Supported locales
     * @param \PKP\context\Context $context Journal or Press to change settings for
     * @param string $imageUploadUrl The API endpoint for images uploaded through the rich text field
     * @param string $temporaryFileApiUrl URL to upload temporary files (PDF masthead)
     */
    public function __construct($action, $locales, $context, $imageUploadUrl, $temporaryFileApiUrl)
    {
        parent::__construct($action, $locales, $context, $imageUploadUrl);

        $this->addField(new FieldText('abbreviation', [
            'label' => __('manager.setup.journalAbbreviation'),
            'isMultilingual' => true,
            'groupId' => 'identity',
            'value' => $context->getData('abbreviation'),
        ]))
            ->addField(new FieldUpload('mastheadPdfUrl', [
                'label' => __('manager.setup.mastheadPdfUrl'),
                'description' => __('manager.setup.mastheadPdfUrl.description'),
                'groupId' => 'publishing',
                'value' => self::mastheadPdfFormValue($context->getData('mastheadPdfUrl')),
                'options' => [
                    'url' => $temporaryFileApiUrl,
                    'acceptedFiles' => 'application/pdf,.pdf',
                ],
            ]))
            ->addField(new FieldText('publisherInstitution', [
                'label' => __('manager.setup.publisher'),
                'groupId' => 'publishing',
                'value' => $context->getData('publisherInstitution'),
            ]))
            ->addField(new FieldText('publisherUrl', [
                'label' => __('common.url'),
                'groupId' => 'publishing',
                'value' => $context->getData('publisherUrl'),
            ]))
            ->addField(new FieldText('onlineIssn', [
                'label' => __('manager.setup.onlineIssn'),
                'size' => 'small',
                'groupId' => 'publishing',
                'value' => $context->getData('onlineIssn'),
            ]))
            ->addField(new FieldText('printIssn', [
                'label' => __('manager.setup.printIssn'),
                'size' => 'small',
                'groupId' => 'publishing',
                'value' => $context->getData('printIssn'),
            ]));
    }

    /**
     * Normalize legacy string paths for the upload field component.
     *
     * @param mixed $raw Value from context settings
     *
     * @return mixed
     */
    protected static function mastheadPdfFormValue($raw)
    {
        if (is_string($raw) && $raw !== '') {
            return [
                'name' => basename($raw),
                'uploadName' => $raw,
            ];
        }

        return $raw;
    }
}
