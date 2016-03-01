$(function(){
	//Model for Services.
	var Service = Backbone.Model.extend({
		defaults:{
			title: "My Service",
			price: 100,
			checked: false
		},
		//Helper function for checking/unchecking the service.
		toggle: function(){
			this.set('checked', !this.get('checked'));
		}
	});
	//Collection of Services
	var ServiceCollection = Backbone.Collection.extend({
		//will hold objects of Service model.
		model: Service,
		//Return an array only with checked services
		getChecked: function(){
			return this.where({checked:true});
		}
		
	});
	//Prefill the ServiceCollection with a number of services
	var services = new ServiceCollection ([
	    new Service({title:"printing",price:400}),
		new Service({title:"painting",price:600}),
		new Service({title:"web development",price:700}),
		new Service({title:"coffee drinking",price:100})
	]);
	//View for Services. This view turns service model into HTML and adds LI elements.
	var ServiceView = Backbone.View.extend({
		tagName: 'li',
		events: {
			'click': 'toggleService'
		},
		initialize: function(){
			//Setup event listeners.
			//The change backbone event is raised when a property changes.
			this.listenTo(this.model, 'change', this.render);
		},
		render: function(){
			//create the HTML
			this.$el.html('<input type="checkbox" value="1" name="' + this.model.get('title') + '" /> ' + this.model.get('title') + '<span>$' + this.model.get('price') + '</span>');
			this.$('input').prop('checked', this.model.get('checked'));
			return this;
		}
	});
	//The main view of the appication which loops thorugh all the services in collection and listens change event.
	var App = Backbone.View.extend({
		el: $('#main'),
		initialize: function(){
			this.total = $('#total span');
			this.list = $('#services');
			
			this.listenTo(services, 'change', this.render);
			//Create views for each of the services in collection and add them to the page.
			services.each(function(service){
				var view = new ServiceView({model: service});
				this.list.append(view.render().el);
			},this);
		},
		render: function(){
			//Calculate total order amount 
			var total =0;
			_.each(services.getChecked(),function(elem){
				total += elem.get('price');
			});
			this.total.text('$'+total);
			return this;
		}
	});
	new App();
});