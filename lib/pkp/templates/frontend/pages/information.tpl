{**
 * templates/frontend/pages/information.tpl
 *
 * Copyright (c) 2014-2021 Simon Fraser University
 * Copyright (c) 2003-2021 John Willinsky
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * Information page.
 *
 *}
{if !$contentOnly}
	{include file="frontend/components/header.tpl" pageTitle=$pageTitle}
{/if}

<div class="page page_information">
	{include file="frontend/components/breadcrumbs.tpl" currentTitleKey=$pageTitle}
	<h1>
		{translate key=$pageTitle}
	</h1>
	{include file="frontend/components/editLink.tpl" page="management" op="settings" path="website" anchor="setup/information" sectionTitleKey="manager.website.information"}

	{if $pageTitle === 'navigation.infoForReaders.long' && $mastheadPdfUrl}
		<div class="cmp_notification">
			<strong>{translate key="manager.setup.mastheadPdfUrl"}:</strong>
			<a href="{$baseUrl}/pdf-viewer.html?file={$mastheadPdfUrl|escape:'url'}" target="_blank" rel="noopener">
				{$mastheadPdfUrl|escape}
			</a>
		</div>
	{/if}

	<div class="description">
		{$content}
	</div>
</div>

{if !$contentOnly}
	{include file="frontend/components/footer.tpl"}
{/if}
