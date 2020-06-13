/**
 * ListView: This class represents an collection of divs to be rendered as
 * scrollable list
 * @constructor
 * @param {string} id - An id of the div where list will be rendered
 * @param {Array} items - An array of string containing the text for each item
 */
var ListView = Class.create({
	id: null,
	items: [],
	initialize: function(id, items) {
		this.id = id;
		this.items = items;
		this.refresh(this.items);
	},
	refresh: function(items) {
		var target = $j('#' + this.id);
		target.empty();
		target.addClass('list-view-wrap');

		items.forEach(function(item) {
			var html = `<div class='list-view-item'>
							<pre class='list-view-item-pre'>` 
								+ w2utils.encodeTags(item) + 
							`</pre>
						</div>`;
			target.append(html);
		});

		var listView = this;
		$j('#' + this.id + ' div').each(function() {
			var that = this;
			this.onclick = function() {
				$j('#' + listView.id + ' div').removeClass('list-view-item-selected');
				$j(that).addClass('list-view-item-selected');
			};
		});
	}
}); 