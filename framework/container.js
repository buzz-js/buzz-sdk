import { Alignment } from "../alignment/alignment.js";
import { Border } from "../style/border.js";
import { RadialGeometry } from "../style/insets.js";
import { MATCH_CONTENT, MATCH_PARENT, WidgetStyle } from "../style/style.js";
import { panic } from "./utilities.js";
import { Widget, StatelessWidget } from "./widget.js";
import { StatefulWidget } from "./state.js";
import { DEBUG_LOG } from "./context.js";

/**
 * This is the base class that all containers that can hold only one child inherit from. They can also be called LeasContainers.
 */
class SingleChildContainer extends StatelessWidget {
	/**
	 * @type {ContainerStyle}
	 */
	style;
	
	/**
	 * This is the only child in a Widget with just one child.
	 * 
	 * @type {Widget}
	 */
	child;

	/**
	 * 
	 * @param {AppContext} context 
	 * @param {Widget} child 
	 * @param {ContainerStyle} style 
	 */
	constructor(child, style = null) {
		super();
		this.child = child;
		this.style = style;

		if(child !== null && child !== undefined) {
			child.parent = this; // We are this child's parent so this should be bound here.
		}
	}

	/**
	 * This function is used to apply styling to the body of a container. It is typically universal since all containers implement
	 * the same kind of styling. However, if your custom widget has more styling elements it requires, this would easily prove to
	 * be insufficient.
	 */
	applyStyle(canFlex = true) {
		super.applyStyle(canFlex);

		// Then we check for styling.
		if(this.style) {
			this.raw.style.backgroundColor 	= this.style.backgroundColor; // First, set the background Color
			this.raw.style.height 			= this.style.height;
			this.raw.style.width 			= this.style.width;

			// If this Widget is either a flexbox widget or is allowed to be converted to one  
			if(canFlex) {
				switch(this.style.alignment?.value) { // Then we can go on with alignment.
					case Alignment.bottomCenter.value: {
						this.raw.style.alignItems = "end"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "center"; // Align the items inside the view to the center horizontally
	
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.bottomLeft.value: {
						this.raw.style.alignItems = "end"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "start"; // Align the items inside the view to the center horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.bottomRight.value: {
						this.raw.style.alignItems = "end"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "end"; // Align the items inside the view to the end horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.center.value: {
						this.raw.style.alignItems = "center"; // Align the items inside the view to the center vertically
						this.raw.style.justifyContent = "center"; // Align the items inside the view to the center horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.centerLeft.value: {
						this.raw.style.alignItems = "center"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "start"; // Align the items inside the view to the center horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.centerRight.value: {
						this.raw.style.alignItems = "center"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "end"; // Align the items inside the view to the end horizontally
						this.raw.style.display = 'flex';
					}	break;
	
	
					case Alignment.topCenter.value: {
						this.raw.style.alignItems = "start"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "center"; // Align the items inside the view to the center horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.topLeft.value: {
						this.raw.style.alignItems = "start"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "start"; // Align the items inside the view to the center horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.topRight.value: {
						this.raw.style.alignItems = "start"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "end"; // Align the items inside the view to the end horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case null:
					case undefined: {
						// We do nothing in this case.
					}	break;
	
					default: {
						throw("Invalid. Unexpected alignment value " + this.style.alignment.constructor.name + ". You are not allowed to create your own alignment implementations.");
					}
				}

				// After performing this switch out... check if this alignment was forced to sit at some baseline.
				if(this.style.alignment) {
					if(this.style.alignment.forced) {
						this.raw.style.alignItems = "baseline";
					}
				}
			}

			else {
				if(this.context.debugLevel === DEBUG_LOG) {
					console.info("Detected alignment in a container that is not flexbox-based ("+this.constructor.name+"). Switching to its implementation of an alignment if there is any.");
				}
			}
		}

		// Now, to apply default styling to this Widget...
		else {
			// First, we retrieve the theme from the context in order to get the background color.
			this.raw.style.backgroundColor 	= this.context.theme?.backgroundColor; 
			this.raw.style.height 			= MATCH_CONTENT;
			this.raw.style.width 			= MATCH_CONTENT;
		}
	}

	/**
	 * Helper function used by the library to draw the children of this container. Should never be called directly from your code.
	 * Otherwise, it MIGHT lead to unexpected behavior, and in some worst case scenarios, it could even break your app's runtime. 
	 */
	renderChild() {
		if(!this.raw) {
			panic("Attempted to render the child of a Widget before it's HTML viewport had been created.", this);
		}

		// After that, we attempt to render your child.
		// Finally, if this widget was created with a child, we build the child and place it inside the container.
		if(this.child) {
			let widget = this.child.render(this); // First we render this child

			// Next, if the child is not built yet... meaning this is not a Widget that is directly drawn.
			// This means that the Widget in question is a ghost widget, hence not drawn. This is a necessary
			// optimization so the HTML viewport is not filled with unnecessary views.
			while(!widget || !widget.mounted) {
				// Stop if at some point things just begin to get weird.
				if(!widget) {
					throw("Attempted to rendering an undefined widget. Cannot pass null or undefined as the result for render.");
				}

				// If this is a StatefulWidget
				if(widget instanceof StatefulWidget) {
					widget.built = true; // Let it know it has been built.
				}

				// Finally, call this widget's postRender function
				widget.postRender(widget.context);

				// Finally, move forward from here so we go to the next Widget.
				widget = this.child.render(widget); // Render yourself again 
			}

			// If we have finally derived a sensible rendering tree...
			// First, this LeafContainer is the ancestor of the widget that is its child
			widget.ancestor = this;

			// This widget has been built, so you can change state if you wish.
			if(widget instanceof StatefulWidget) {
				// Next, we notify the widget that it has been build.
				widget.built = true;
			}

			// Finally, make this the contents of the Scrollable Container
			this.raw.appendChild(widget.raw);

			// This widget has been mounted.
			this.child.mounted = true;

			// Now we invoke the function after the call to render.
			this.child.postRender(widget.context);
		}
	}

	unmount(context) {
		if(!super.unmount(context)) {
			return false;
		}

		// If we could unmount the other Widget... that's great. We however still need something.
		return this.child?.unmount(context); // Unmount the child too.
	}

	remove(context) {
		super.remove(context);

		// After removing yourself...
		this.child?.remove(context); // Remove your child as well.
	}
}


/**
 * 
 */
class Container extends StatelessWidget {
	/**
	 * @type {ContainerStyle}
	 */
	style;

	/**
	 * The widgets that this container wraps around. Typically the widgets that branch from this container.
	 * @type {Widget[]}
	 */
	children;


	/**
	 * @param {Widget[]} children The children inside this container. 
	 * @param {ContainerStyle} style The style used for this container.
	 */
	 constructor({
		children = null,
		style = null
	} ={}) {
		super();
		this.children = children;
		this.style = style;

		// If this is not an array
		if(!children instanceof Array) {
			throw ("The children field of a Container must be an array of Widgets");
		}
	}

	/**
	 * This function is used to apply styling to the body of a container. It is typically universal since all containers implement
	 * the same kind of styling. However, if your custom widget has more styling elements it requires, this would easily prove to
	 * be insufficient.
	 */
	applyStyle(canFlex = true) {
		super.applyStyle(canFlex);

		// Then we check for styling.
		if(this.style) {
			this.raw.style.backgroundColor 	= this.style.backgroundColor; // First, set the background Color
			this.raw.style.height 			= this.style.height;
			this.raw.style.width 			= this.style.width;

			// If this Widget is either a flexbox widget or is allowed to be converted to one  
			if(canFlex) {
				switch(this.style.alignment?.value) { // Then we can go on with alignment.
					case Alignment.bottomCenter.value: {
						this.raw.style.alignItems = "end"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "center"; // Align the items inside the view to the center horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.bottomLeft.value: {
						this.raw.style.alignItems = "end"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "start"; // Align the items inside the view to the center horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.bottomRight.value: {
						this.raw.style.alignItems = "end"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "end"; // Align the items inside the view to the end horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.center.value: {
						this.raw.style.alignItems = "center"; // Align the items inside the view to the center vertically
						this.raw.style.justifyContent = "center"; // Align the items inside the view to the center horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.centerLeft.value: {
						this.raw.style.alignItems = "center"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "start"; // Align the items inside the view to the center horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.centerRight.value: {
						this.raw.style.alignItems = "center"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "end"; // Align the items inside the view to the end horizontally
						this.raw.style.display = 'flex';
					}	break;
	
	
					case Alignment.topCenter.value: {
						this.raw.style.alignItems = "start"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "center"; // Align the items inside the view to the center horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.topLeft.value: {
						this.raw.style.alignItems = "start"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "start"; // Align the items inside the view to the center horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case Alignment.topRight.value: {
						this.raw.style.alignItems = "start"; // Align the items inside the view to the end vertically
						this.raw.style.justifyContent = "end"; // Align the items inside the view to the end horizontally
						this.raw.style.display = 'flex';
					}	break;
	
					case null:
					case undefined: {
						// We do nothing in this case.
					}	break;
	
					default: {
						throw("Invalid. Unexpected alignment value " + this.style.alignment.constructor.name + ". You are not allowed to create your own alignment implementations.");
					}
				}

				// After performing this switch out... check if this alignment was forced to sit at some baseline.
				if(this.style.alignment !== null && this.style.alignment !== undefined) {
					if(this.style.alignment.forced) {
						this.raw.style.alignItems = "baseline";
					}
				}
			}

			else {
				if(this.context.debugLevel === DEBUG_LOG) {
					console.info("Detected alignment in a container that is not flexbox-based ("+this.constructor.name+"). Switching to its implementation of an alignment if there is any.");
				}
			}
		}

		// Now, to apply default styling to this Widget...
		else {
			// First, we retrieve the theme from the context in order to get the background color.
			this.raw.style.backgroundColor 	= this.context.theme?.backgroundColor; 
			this.raw.style.height 			= MATCH_PARENT;
			this.raw.style.width 			= MATCH_PARENT;
		}
	}

	/**
	 * A helper function used to render the children of any multiple child container. Usually used to keep things as DRY 
	 * as possible in order not to waste space inside of the code. Should really not be called outside of the framework.
	 */
	renderChildren() {
		if(!this.raw) {
			panic("Attempted to render the children of a Widget before it's HTML viewport had been created.", this);
		}

		// Replace all the children with a very blank array first.
		this.raw.replaceChildren([]);

		// After that, we attempt to render your child.
		// Finally, if this widget was created with its list of children, we build the children and place them inside the container.
		if(this.children) {
			this.children.forEach(child => {
				let widget = child.render(this); // First we render this child

				// Next, if the child is not built yet... meaning this is not a Widget that is directly drawn.
				// This means that the Widget in question is a ghost widget, hence not drawn. This is a necessary
				// optimization so the HTML viewport is not filled with unnecessary views.
				while(!widget || !widget.mounted) {
					// Stop if at some point things just begin to get weird.
					if(!widget) {
						throw("Attempted to rendering an undefined widget. Cannot pass null or undefined as the result for render.");
					}

					// If this is a StatefulWidget
					if(widget instanceof StatefulWidget) {
						widget.built = true; // Let it know it has been built.
					}

					// Finally, call this widget's postRender function
					widget.postRender(widget.context);

					// Finally, move forward from here so we go to the next Widget.
					widget = child.render(widget); // Render yourself again 
				}

				// If we have finally derived a sensible rendering tree...
				// First, this Container is the ancestor of the widget that is its child. The ancestor of a Widget is 
				widget.ancestor = this;

				// This widget has been built, so you can change state if you wish.
				if(widget instanceof StatefulWidget) {
					// Next, we notify the widget that it has been build.
					widget.built = true;
				}

				// Finally, append this Widget to the body of this container.
				this.raw.appendChild(widget.raw);

				// This widget has been mounted.
				child.mounted = true;

				// Now we invoke the function after the call to render.
				child.postRender(widget.context);
			});
		}
	}

	unmount(context) {
		if(!super.unmount(context)) {
			return false;
		}

		let did = true;

		// For each child you have.
		children?.forEach(function (child) {
			did = child.unmount(context);
		});

		// If we could unmount the other Widget... that's great. We however still need something.
		return did; // Unmount the child too.
	}

	remove(context) {
		super.remove(context);
		// After removing yourself...

		// For each child you have.
		children?.forEach(function (child) {
			child.remove(context); // Remove as well.
		});
	}
}


/**
 * This is the class that helps style containers of any shape and size. It is useful basically there is an apparent need to style the
 * layout of a container before drawing its children.
 */
class ContainerStyle extends WidgetStyle {
	/**
	 * @type {Border}
	 */
	 border;

	/**
	 * @type {RadialGeometry}
	*/
	borderRadius;

	/**
	 * The color that represents the background of this Container.
	 *
	 * @type {string}
	 */
	backgroundColor;

	/**
	 * How to align the contents inside this container. This is very useful and cannot be underestimated.
	 *
	 * @type {Alignment}
	 */
	alignment;

	/**
	 * 
	 * @param {*} param0 
	 */

	constructor ({
		height = MATCH_PARENT,
		width = MATCH_PARENT,
		backgroundColor = 'transparent',
		borderRadius = null,
		border = null,
		alignment = null
	} = {}) {
		super(backgroundColor, {
			background: backgroundColor, 
			height: height, 
			width: width
		});
		this.backgroundColor = backgroundColor;
		this.borderRadius = borderRadius;
		this.border = border;
		this.alignment = alignment;
	}
}

export {
	Container,
	ContainerStyle,
	SingleChildContainer,
	SingleChildContainer as LeafContainer
}