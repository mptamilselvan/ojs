/**
 * Local PDF preview when a PDF is chosen in Journal Settings → Masthead (before save).
 * Targets file inputs that accept PDF only (masthead upload field).
 */
(function () {
	var previewUrl = null;
	var previewId = 'mastheadPdfLocalPreviewFrame';

	function revokePreview() {
		var el = document.getElementById(previewId);
		if (el && el.parentNode) {
			el.parentNode.removeChild(el);
		}
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			previewUrl = null;
		}
	}

	function isPdfFile(file) {
		if (!file) {
			return false;
		}
		if (file.type === 'application/pdf') {
			return true;
		}
		return /\.pdf$/i.test(file.name || '');
	}

	function acceptAllowsPdf(accept) {
		if (!accept) {
			return false;
		}
		var a = accept.toLowerCase();
		return a.indexOf('pdf') !== -1 || a.indexOf('application/pdf') !== -1;
	}

	function appendPreview(file, input) {
		revokePreview();
		previewUrl = URL.createObjectURL(file);
		var iframe = document.createElement('iframe');
		iframe.id = previewId;
		iframe.title = 'PDF preview';
		iframe.style.width = '100%';
		iframe.style.height = '28rem';
		iframe.style.border = '1px solid #cbd5e1';
		iframe.style.borderRadius = '4px';
		iframe.style.marginTop = '0.75rem';
		iframe.style.background = '#fff';
		iframe.src = previewUrl;

		var field = input && input.closest ? input.closest('.pkpFormField') : null;
		if (!field) {
			field = document.querySelector('.pkpFormField');
		}
		if (field) {
			field.appendChild(iframe);
		} else {
			var app = document.getElementById('app');
			(app || document.body).appendChild(iframe);
		}
	}

	function onChange(ev) {
		var input = ev.target;
		if (!input || input.type !== 'file' || !input.files || !input.files[0]) {
			return;
		}
		if (!acceptAllowsPdf(input.getAttribute('accept') || '')) {
			return;
		}
		var file = input.files[0];
		if (!isPdfFile(file)) {
			return;
		}
		appendPreview(file, input);
	}

	function init() {
		document.body.addEventListener('change', onChange, true);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
