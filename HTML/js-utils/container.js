
var MG_HOST_LIMIT = 6

/* select-all and unselect-all on the tables */
function toggle(source) {
	checkboxes = document.getElementsByName('selection');
	for(var i in checkboxes)
		checkboxes[i].checked = source.checked;
}

$(document).on('submit', 'form', function(e){
    // validation code here
    e.preventDefault();

    var form = $(this);
    var id = form.attr('id');

    if (id === "newappform") {
    	createNewApp(form);
    }
});


function createNewApp(form) {

	var csrfinput = form.find('input[name=csrfmiddlewaretoken]');
	var csrf = csrfinput.val();

	var data = {};

	var app_name_input = form.find('#app_name_input');
	var app_product_select =form.find('#app_product_select');
	var app_version_select = form.find('#app_version_select');
	var app_host_count_select = form.find('#app_host_count_select');
	var patch_select = form.find('#patch_select');
	var start_cluster_after_creation_checkbox = $('#start_cluster_after_creation_checkbox');
	var cluster_is_public_checkbox = $('#cluster_is_public_checkbox');

	var app_name = app_name_input.val();

	var hostname_prefix = $("#hostname_prefix_input").val().trim();

	if (app_name.indexOf(' ') > -1) {
		var msg = 'Cluster name should not contain space';
		UIkit.notification(msg, {
			pos: 'bottom-right',
			status: 'warning',
			timeout: 5000
		});
		return;
	} else if (app_name.length >= 39) {
		var msg = 'Cluster name should be less than 39 characters';
		UIkit.notification(msg, {
			pos: 'bottom-right',
			status: 'warning',
			timeout: 5000
		});
		return;
	}

	if (hostname_prefix > 0) {
		if (hostname_prefix.indexOf(' ') > -1) {
			var msg = 'Host name prefix should not contain space';
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 5000
			});
			return;
		} else if (hostname_prefix.length >= 20) {
			var msg = 'Host name prefix should be less than 20 characters';
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 5000
			});
			return;
		} else {
			if (/[a-zA-Z0-9]/.test(hostname_prefix.charAt(0)) == false) {
				var msg = 'First character of the host name prefix must be a-zA-Z0-9';
				UIkit.notification(msg, {
					pos: 'bottom-right',
					status: 'warning',
					timeout: 5000
				});
				return;
			}
		}
	}

	var app_product = app_product_select.val();
	var use_dns = 'N';
	var app_domain = '';

	if ($("#use_dns_checkbox").is(":checked")) {
		use_dns = 'Y';
		app_domain = $("#domain_input").val().trim();
		if (app_domain.length > 252) {
			var msg = 'Domain name should be shorter than 253 characters';
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 5000
			});
			return;
		}
	}

	var app_version = "";
	var use_template = "N";
	var version_selected_option = app_version_select.find("option:selected");
	var uuid = version_selected_option.attr("uuid");
	if (uuid === undefined) { //use template
		use_template = "N";
	} else {
		use_template = "Y";
	}
	var simdata_path = $("#simdata_path_input").val().trim();

	if (app_product === "LSFSIM" && use_template === "N") {
		if (simdata_path.length == 0) {
			var msg = 'Simulation data path cannot be empty';
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 5000
			});
			return;
		}
	}

	/* LSF add-on products */
	var install_ls_checkbox = $("#install_ls_checkbox");
	var install_dm_checkbox = $("#install_dm_checkbox");
	var install_pac_checkbox = $("#install_pac_checkbox");
	var install_rtm_checkbox = $("#install_rtm_checkbox");
	var install_pws_checkbox = $("#install_pws_checkbox");

	var install_ls = "N";
	var install_dm = "N";
	var install_pac = "N";
	var install_rtm = "N";
	var install_pws = "N";

	var ls_version = "";
	var dm_version = "";
	var pac_version = "";
	var rtm_version = "";
	var pws_version = "";


	if (install_ls_checkbox.is(':checked')) {
		install_ls = "Y";
		ls_version = $("#ls_version_select").val();
	}

	if (install_dm_checkbox.is(':checked')) {
		install_dm = "Y";
		dm_version = $("#dm_version_select").val();
	}

	if (install_pac_checkbox.is(':checked')) {
		install_pac = "Y";
		pac_version = $("#pac_version_select").val();
	}

	if (install_rtm_checkbox.is(':checked')) {
		install_rtm = "Y";
		rtm_version = $("#rtm_version_select").val();
	}

	if (install_pws_checkbox.is(':checked')) {
		install_pws = "Y";
		pws_version = $("#pws_version_select").val();
	}


	data.install_ls = install_ls;
	data.install_dm = install_dm;
	data.install_pac = install_pac;
	data.install_rtm = install_rtm;
	data.install_pws = install_pws;

	data.ls_version = ls_version;
	data.dm_version = dm_version;
	data.pac_version = pac_version;
	data.rtm_version = rtm_version;
	data.pws_version = pws_version;

	data.use_dns = use_dns;
	data.app_domain = app_domain;

	data.hostname_prefix = hostname_prefix;
	data.simdata_path = simdata_path;
	data.use_template = use_template;

	if (use_template === "N") {
		data.app_version = app_version_select.val();
	} else {
		data.template_uuid = uuid;
		data.app_version = version_selected_option.attr("version");
	}
	var app_host_count = app_host_count_select.val();
	var patch_number = patch_select.siblings('.select-dropdown').val();
	var start_cluster_after_creation = 'Y';
	if (start_cluster_after_creation_checkbox.is(':checked')) {
		start_cluster_after_creation = 'Y';
	} else {
		start_cluster_after_creation = 'N';
	}

	var cluster_is_public = 'N';
	if (cluster_is_public_checkbox.is(':checked')) {
		cluster_is_public = 'Y';
	}

	data.app_name = app_name;
	data.app_product = app_product;
	data.app_host_count = app_host_count;
	data.patch_number = patch_number;
	data.start_cluster_after_creation = start_cluster_after_creation;
	data.cluster_is_public = cluster_is_public;
	data.csrf = csrf;

	var app_mg_count = 2;
	if (app_product === "Symphony") {
		data.app_mg_count = form.find('#app_mg_count_select').val();
	}

	display_spin($('#createnewappbuttonpack'), $('#createnewappspin'));

	ajaxPost('create_app', data, function(content) {
		var status = content.status;
		var msg = content.msg;

		if (status !== "200") {
			hide_spin($('#createnewappbuttonpack'), $('#createnewappspin'));
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 500000
			});
		} else {
        	//TODO: navigate to the app page with containers in it
        	var app_id = content.app_id
        	var url = 'dockerapp/app/' + app_id;
        	window.location = url;
        }
    });
}

$(document).on('click', '#createNewAppButtonSingle', function() {
	var url = 'dockerapp/newapp';
	window.location = url;
});

function deleteApps(ids) {

	display_spin($('#deleteappbuttonpack'), $('#deleteappspin'));
	var data = {};
	data.ids = ids;
	ajaxPost('delete_app', data, function(content) {
		var status = content.status;
		var msg = content.msg;


		if (status !== "200") {
			hide_spin($('#deleteappbuttonpack'), $('#deleteappspin'));
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 500000
			});
		} else {
			location.reload();
		}
	});
}

function deleteTemplates(ids) {

	display_spin($('#deletetemplatebuttonpack'), $('#deletetemplatespin'));
	var data = {};
	data.ids = ids;
	ajaxPost('delete_template', data, function(content) {
		var status = content.status;
		var msg = content.msg;


		if (status !== "200") {
			hide_spin($('#deletetemplatebuttonpack'), $('#deletetemplatespin'));
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 500000
			});
		} else {
			location.reload();
		}
	});
}

function stopContainers(container_names) {

	display_spin($('#stopcontainerbuttonpack'), $('#stopcontainerspin'));
	var data = {};
	data.container_names = container_names;
	ajaxPost('stop_container', data, function(content) {
		var status = content.status;
		var msg = content.msg;


		if (status !== "200") {
			hide_spin($('#stopcontainerbuttonpack'), $('#stopcontainerspin'));
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 500000
			});
		} else {
			location.reload();
		}
	});
}

function deleteContainers(container_names) {

	display_spin($('#deletecontainerbuttonpack'), $('#deletecontainerspin'));
	var data = {};
	data.container_names = container_names;
	ajaxPost('delete_container', data, function(content) {
		var status = content.status;
		var msg = content.msg;

		if (status !== "200") {
			hide_spin($('#deletecontainerbuttonpack'), $('#deletecontainerspin'));
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 500000
			});
		} else {
			location.reload();
		}
	});
}

function startContainers(container_names) {

	display_spin($('#startcontainerbuttonpack'), $('#startcontainerspin'));
	var data = {};
	data.container_names = container_names;
	ajaxPost('start_container', data, function(content) {
		var status = content.status;
		var msg = content.msg;

		if (status !== "200") {
			hide_spin($('#startcontainerbuttonpack'), $('#startcontainerspin'));
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 500000
			});
		} else {
			location.reload();
		}
	});
}

function saveApp(app_id, template_description, public) {

	display_spin($('#saveappbuttonpack'), $('#saveappspin'));
	var data = {};
	data.app_id = app_id;
	data.description = template_description;
	data.public = public;
	ajaxPost('backup_app', data, function(content) {
		hide_spin($('#saveappbuttonpack'), $('#saveappspin'));
		status = content.status;
		msg = content.msg;
		if (status !== "200") {
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 500000
			});
		} else {
			$("#cancelsaveappbutton").trigger('click');
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'success',
				timeout: 500000
			});
		}
	});
}

$(document).on('click', '#saveappbutton', function(e) {
	var app_id = $('#app_id').attr('data-id');
	var template_description = $('#template_description_input').val().trim();
	var public = "Y";

	if (template_description.length == 0) {
		UIkit.notification("Please don't leave template description as empty", {
			pos: 'bottom-right',
			status: 'warning',
			timeout: 5000
		});
		return;
	} else if (template_description.length > 30) {
		UIkit.notification("The template description needs to be shorter than 30 characters", {
			pos: 'bottom-right',
			status: 'warning',
			timeout: 5000
		});
		return;
	}

	if ($("#template_public_checkbox").is(':checked')) {
		public = "Y";
	} else {
		public = "N";
	}
	saveApp(app_id, template_description, public);
});


$(document).on('click', '#deleteappbutton', function(e) {

	var ids = [];
	$('#myappstablediv input:checkbox[name=selection]:checked').each(function() {
		var me = $(this);
		appId = me.val();
		ids.push(appId);
	});

	deleteApps(ids);
});

$(document).on('click', '#deletetemplatebutton', function(e) {

	var ids = [];
	$('#mytemplatestablediv input:checkbox[name=selection]:checked').each(function() {
		var me = $(this);
		templateId = me.val();
		ids.push(templateId);
	});

	deleteTemplates(ids);
});

$(document).on('click', '#stopcontainerbutton', function(e) {

	var container_names = [];
	$('#appdiv input:checkbox[name=selection]:checked').each(function() {
		var me = $(this);
		container_name = me.val();
		container_names.push(container_name);
	});

	stopContainers(container_names);
});

$(document).on('click', '#deletecontainerbutton', function(e) {

	var container_names = [];
	$('#appdiv input:checkbox[name=selection]:checked').each(function() {
		var me = $(this);
		container_name = me.val();
		container_names.push(container_name);
	});

	deleteContainers(container_names);
});

$(document).on('click', '#startcontainerbutton', function(e) {

	me = $(this);

	var container_names = [];
	$('#appdiv input:checkbox[name=selection]:checked').each(function() {
		var me = $(this);
		container_name = me.val();
		container_names.push(container_name);
	});

	startContainers(container_names);
});


function fill_version(data) {
	ajaxPost('get_product_version', data, function(content) {
		var status = content.status;

		if (status !== "200") {
			UIkit.notification("Failed to get version for product " + data.product, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 500000
			});
		} else {
			var versions = content.versions;
			var templates = content.templates;
			$('#app_version_select').empty();
			for (var i = 0; i < versions.length; i++) {
				var version = versions[i];
				$('#app_version_select').append($('<option>', {
					value: version,
					text: version
				}));
			}
			for (var i = 0; i < templates.length; i++) {
				var version = templates[i]['version'];
				var uuid = templates[i]['uuid'];
				var owner = templates[i]['owner'];
				var description = templates[i]['description'];
				var text = "Template: " + version + " " + description + "     " + "Owner: " + owner;
				$('#app_version_select').append($('<option>', {
					value: uuid,
					uuid: uuid,
					version: version,
					text: text
				}));
			}
			$('#app_version_select').material_select();
		}
	});
}

$(document).ready(function () {
	// Fill in LSF'version with the default version and template

	var page = window.location.href;
	if (page.indexOf('newapp') > -1) {
		var data = {};
		data.product = "LSF";
		fill_version(data);
	}
});

$(document).on('change', '#app_product_select', function(e) {

	var me = $(this);

	fill_patch_select();

	var product = me.val();

	$("#hostname_prefix_input").val("");
	$("#hostname_prefix_input").blur();
	$("#hostname_prefix_input").prop('disabled', false);

	var data = {};
	data.product = me.val();

	if (data.product === "Symphony") {

		$("#mg_select_div").remove();
		mg_selection_html = '<div id="mg_select_div" class="uk-margin">\
		<label class="uk-form-label" for="app_mg_count_select">Numer of Management Hosts:</label>\
		<div class="uk-form-controls input-field col s12 m6">\
		<select name="app_mg_count" id="app_mg_count_select"></select>\
		</div>\
		</div>';

		$("#app_host_count_select").closest(".uk-margin").after(mg_selection_html);

		for (var i = 0; i < MG_HOST_LIMIT; i++) {
			$('#app_mg_count_select').append($('<option>', {
				value: i + 1,
				text: i + 1
			}));
		}
		$('#app_mg_count_select').val(2);

		var app_mg_count = $("#app_mg_count_select").val();
		var app_host_count = $("#app_host_count_select").val();

		if (app_mg_count > app_host_count) {
			$("#app_mg_count_select").val(app_host_count);
		}

		$('#app_mg_count_select').material_select();

	} else {
		reset_addon();
		$("#mg_select_div").remove();
	}

	switch_addons(product);

	if (data.product === "LSF") {
		show_host_count_select("Y");
		show_hostname_prefix_select("Y");
		show_simdata_path_input("N");
	} else if (data.product === "PPM") {
		/* TODO: display add-on: RTM for SAS */
		show_host_count_select("Y");
		show_hostname_prefix_select("Y");
		show_simdata_path_input("N");
	} else if (data.product === "LSFSIM") {
		/* LSF Simulator */
		show_host_count_select("N");
		show_hostname_prefix_select("N");
		show_simdata_path_input("Y");
	} else {
		show_host_count_select("Y");
		show_hostname_prefix_select("Y");
		show_simdata_path_input("N");
	}

	fill_version(data);
});


$(document).on('change', '#app_mg_count_select', function(e) {
	var app_mg_count = $("#app_mg_count_select").val();
	var app_host_count = $("#app_host_count_select").val();

	if (parseInt(app_mg_count) > parseInt(app_host_count)) {
		$("#app_host_count_select").val(app_mg_count);
		$("#app_host_count_select").material_select();
	}
});

$(document).on('change', '#app_host_count_select', function(e) {
	var app_mg_count = $("#app_mg_count_select").val();
	var app_host_count = $("#app_host_count_select").val();

	if (parseInt(app_mg_count) > parseInt(app_host_count)) {
		$("#app_mg_count_select").val(app_host_count);
		$("#app_mg_count_select").material_select();
	}
});


$(document).on('click', '#myapps_actions_button', function(e) {

	$('.menuli').each(function() {
		me = $(this);
		me.css('display', 'list-item');
	});
	if (!$("#myappstablediv").length || !$('#myappstablediv input:checkbox[name=selection]:checked').length) {
		$("#deleteappmenuli").css('display', 'none');
	}
});


/*
$(document).on('click', '#app_actions_button', function(e) {
	console.log('clicking on app_actions_button');

	$('#app_actions_button .uk-dropdown').css('display', 'block');
	if (!$("#appdiv").length || !$('#appdiv input:checkbox[name=selection]:checked').length) {
		$('#app_actions_button .uk-dropdown').css('display', 'none');
		msg = 'No hosts selected.'
		UIkit.notification(msg, {
			pos: 'bottom-right',
			status: 'warning',
			timeout: 3000
		});
	}
});
*/

function copyToClipboard(text) {
	var $temp = $("<input>");
	$("body").append($temp);
	$temp.val(text).select();
	document.execCommand("copy");
	$temp.remove();
}

$(document).on('click', '.copy_to_clipboard', function(e) {
	var me = $(this);
	var text = me.attr('data-sshcommand');
	var host_name = me.closest('tr').find('.container_host_name').text();
	copyToClipboard(text);
	msg = 'SSH command to ' +  host_name  + ' is copied to clipboard';
	UIkit.notification(msg, {
		pos: 'bottom-right',
		status: 'success',
		timeout: 5000
	});
});


$(document).ready(function() {
	var page = window.location.href;
	if (page.indexOf('newapp') > -1) {
		fill_patch_select();
	}
});


$(document).on('change', '#app_version_select', function(e) {
	fill_patch_select();
	var me = $(this);
	var version = me.val();

	var product = $("#app_product_select").val();

	if (version.indexOf('-') > -1) { // template
		if (product === "LSF") {
			show_addons("N");
		} else if (product === "LSFSIM") {
			show_simdatapath_select("N");
		}
		data = {}
		data.template_uuid = version;
		ajaxPost('get_template_info', data, function(content) {
			var status = content.status;
			var results = content.results;

			if (status === "200") {
				var template_hostname_prefix = results.template_hostname_prefix;
				$("#hostname_prefix_input").focus();
				$("#hostname_prefix_input").val(template_hostname_prefix);
				$("#hostname_prefix_input").prop('disabled', true);
			}
		});
	} else {
		if (product === "LSF") {
			show_addons("Y");

			if (version === "9.1.3") {
				$("#install_dm_checkbox").prop('disabled', false);
				$("#dm_version_select").val("9.1.3");
				$("#dm_version_select").material_select();
			} else if (version === "10.1.0") {
				$("#install_dm_checkbox").prop('disabled', false);
				$("#dm_version_select").val("10.1.0");
				$("#dm_version_select").material_select();
			} else {
				$("#install_dm_checkbox").prop('checked', false);
				$("#install_dm_checkbox").prop('disabled', true);
				$("#dm_version_select_div").css('display', 'none');
			}
		} else if (product === "LSFSIM") {
			show_simdatapath_select("Y");
		}
		$("#hostname_prefix_input").val("");
		$("#hostname_prefix_input").blur();
		$("#hostname_prefix_input").prop('disabled', false);
	}
});

function reset_addon() {
	$("#install_dm_checkbox").prop('checked', false);
	$("#install_dm_checkbox").prop('disabled', true);
	$("#dm_version_select_div").css('display', 'none');
}

function fill_patch_select() {
	var product = $("#app_product_select").val();
	var version = $("#app_version_select").val();

	if (product !== 'LSF') {
		$("#patch_select_div").css('display', 'none');
		return;
	} else {
		$("#patch_select_div").css('display', 'block');
	}

	var data = {};
	data.product = product;
	data.version = version;

	ajaxPost('get_patch_list', data, function(content) {
		var status = content.status;
		var patch_list = content.patch_list;

		if (status !== "200") {
			console.log("Failed to get patch list for " + product + " " + version);
		} else {
			$("#patch_select option[value != 'NONE']").remove();
			$.each(patch_list, function(build_number, description) {
				$('#patch_select').append($('<option>', {
					value: build_number,
					text: description
				}));
			});
			$('#patch_select').material_select();
		}
	});
}

$(document).on('click', '#addhostsli', function(e) {
	var app_id = $('#app_id').attr('data-id');

	var data = {};
	data.app_id = app_id;

	ajaxPost('get_limit_of_hosts_to_add', data, function(content) {
		var status = content.status;
		var limit = content.limit;

		if (status === '200') {
			$('#add_host_count_select').empty();
			if (limit === 0) {
				$("#message1").text("You have reached the limit of hosts per cluster. Contact zuml@cn.ibm.com if you need more");
				$("#addcontainerbutton").css("display", "none");
			} else {
				for (var i = 0; i < limit; i++) {
					$('#add_host_count_select').append($('<option>', {
						value: i + 1,
						text: i + 1
					}));
				}
				$('#add_host_count_select').material_select();
			}
		} else {
			console.log(content);
		}
	});
});


$(document).on('click', '#addcontainerbutton', function(e) {
	var app_id = $('#app_id').attr('data-id');
	var count = $('#add_host_count_select').val();

	var data = {};
	data.app_id = app_id;
	data.count = count;

	display_spin($('#addcontainerbuttonpack'), $('#addcontainerspin'));
	ajaxPost('add_container', data, function(content) {
		var status = content.status;
		var msg = content.msg;

		if (status === '200') {
			location.reload();
		} else {
			hide_spin($('#addcontainerbuttonpack'), $('#addcontainerspin'));
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 500000
			});
		}
	});
});

function display_spin(button_pack, spin) {
	button_pack.css('display', 'none');
	spin.css('display', 'inline-block');
}

function hide_spin(button_pack, spin) {
	button_pack.css('display', 'block');
	spin.css('display', 'none');
}

$(document).ready(function() {
	$('#app_product_select').material_select();
	$('#app_version_select').material_select();
	$('#app_host_count_select').material_select();
	$('#ls_version_select').material_select();
	$('#dm_version_select').material_select();
	$('#pac_version_select').material_select();
	$('#rtm_version_select').material_select();
	$('#pws_version_select').material_select();

});


$(document).ready(function(){
	$('.tooltipped').tooltip({delay: 0});
});

$(document).on('click', '#setvisibilitybutton', function(e) {
	var cluster_is_public = $("#setvisibilitylink").attr('data-public');
	var app_id = $('#app_id').attr('data-id');
	set_visibility(app_id, cluster_is_public);
});

function set_visibility(app_id, cluster_is_public) {
	var data = {};
	data.app_id = app_id;
	data.cluster_is_public = cluster_is_public;

	display_spin($('#setvisibilitybuttonpack'), $('#setvisibilityspin'));
	ajaxPost('set_app_visibility', data, function(content) {
		var status = content.status;
		var msg = content.msg;

		if (status === '200') {
			location.reload();
		} else {
			hide_spin($('#setvisibilitybuttonpack'), $('#setvisibilityspin'));
			UIkit.notification(msg, {
				pos: 'bottom-right',
				status: 'warning',
				timeout: 500000
			});
		}
	});
}

$(document).on('change', '#install_ls_checkbox', function(e) {
	var me = $(this);
	if (me.is(':checked')) {
		show_ls_version_select('Y');
	} else {
		show_ls_version_select('N');
	}
});

$(document).on('change', '#use_dns_checkbox', function(e) {
	var me = $(this);
	if (me.is(':checked')) {
		show_domain_input('Y');
	} else {
		show_domain_input('N');
	}
});

function show_domain_input(value) {
	if (value === "Y") {
		$('#domain_input_container').css('display', 'block');
	} else {
		$('#domain_input_container').css('display', 'none');
	}
}

function show_ls_version_select(value) {
	if (value === "Y") {
		$('#ls_version_select_div').css('display', 'block');
	} else {
		$('#ls_version_select_div').css('display', 'none');
	}
}

$(document).on('change', '#install_dm_checkbox', function(e) {
	var me = $(this);
	if (me.is(':checked')) {
		show_dm_version_select('Y');
	} else {
		show_dm_version_select('N');
	}
});

function show_dm_version_select(value) {
	if (value === "Y") {
		$('#dm_version_select_div').css('display', 'block');
	} else {
		$('#dm_version_select_div').css('display', 'none');
	}
}

$(document).on('change', '#install_pac_checkbox', function(e) {
	var me = $(this);
	if (me.is(':checked')) {
		show_pac_version_select('Y');
	} else {
		show_pac_version_select('N');
	}
});


function show_pac_version_select(value) {
	if (value === "Y") {
		$('#pac_version_select_div').css('display', 'block');
	} else {
		$('#pac_version_select_div').css('display', 'none');
	}
}

$(document).on('change', '#install_rtm_checkbox', function(e) {
	var me = $(this);
	if (me.is(':checked')) {
		show_rtm_version_select('Y');
	} else {
		show_rtm_version_select('N');
	}
});


function show_rtm_version_select(value) {
	if (value === "Y") {
		$('#rtm_version_select_div').css('display', 'block');
	} else {
		$('#rtm_version_select_div').css('display', 'none');
	}
}

$(document).on('change', '#install_pws_checkbox', function(e) {
	var me = $(this);
	if (me.is(':checked')) {
		show_pws_version_select('Y');
	} else {
		show_pws_version_select('N');
	}
});


function show_pws_version_select(value) {
	if (value === "Y") {
		$('#pws_version_select_div').css('display', 'block');
	} else {
		$('#pws_version_select_div').css('display', 'none');
	}
}

$(document).ready(function(){
	$('.collapsible').collapsible();
});

function switch_addons(product) {
	// Switch addon on or off based on product:
	console.log(product);

	switch(product) {
		case "LSF":
			$(".lsfaddon").css("display", "block");
			$(".sasaddon").css("display", "none");
			show_addons("Y");
			break;
		case "PPM":
			$(".sasaddon").css("display", "block");
			$(".lsfaddon").css("display", "none");
			show_addons("Y");
			break;

		case "LSFSIM":
		case "Symphony":
			show_addons("N");
			break;
	}
}

function show_addons(value) {
	if (value === "Y") {
		$("#addondiv").css("display", "block");
	} else {
		$("#addondiv").css("display", "none");
	}
}

function show_simdatapath_select(value) {
	if (value === "Y") {
		$("#simdata_input_container").css("display", "block");
	} else {
		$("#simdata_input_container").css("display", "none");
	}
}

function show_hostname_prefix_select(value) {
	if (value === "Y") {
		$("#hostname_prefix_input").closest(".uk-margin").css("display", "block");
	} else {
		$("#hostname_prefix_input").closest(".uk-margin").css("display", "none");
	}
}

function show_host_count_select(value) {

	if (value === "Y") {
		$("#app_host_count_select").closest(".uk-margin").css("display", "block");
	} else {
		$("#app_host_count_select").closest(".uk-margin").css("display", "none");
	}
}

function show_patch_select(value) {

	if (value === "Y") {
		$("#patch_select").closest(".uk-margin").css("display", "block");
	} else {
		$("#patch_select").closest(".uk-margin").css("display", "none");
	}
}

function show_mg_select(value) {

	if (value === "Y") {
		$("#app_mg_count_select").closest(".uk-margin").css("display", "block");
	} else {
		$("#app_mg_count_select").closest(".uk-margin").css("display", "none");
	}
}

function show_simdata_path_input(value) {
	if (value === "Y") {
		$("#simdata_path_input").closest(".uk-margin").css("display", "block");
	} else {
		$("#simdata_path_input").closest(".uk-margin").css("display", "none");
	}
}
