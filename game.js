(
	() => {
		window.addEventListener(
			'DOMContentLoaded',
			(event) => {
				new Audio('./success.mp3');
				new Audio('./failure.mp3');
				preact.render(preact.createElement(Game), document.body);
			}
		);

		class Game extends preact.Component {
			constructor() {
				super();
				this.state.problem = this.generate_problem();
			}

			generate_problem() {
				const max_sum = 10;
				const bigger = ~~((max_sum + 1) * Math.random());
				const smaller = ~~((Math.min(bigger, 10 - bigger) + 1) * Math.random());

				if (Math.random() < 0.5) {
					return {
						statement: `${bigger} \u2212 ${smaller}`,
						answer: bigger - smaller,
					};
				} else {
					const addends = [bigger, smaller];
					const firstIndex = Math.round(Math.random());
					return {
						statement: `${addends[firstIndex]} + ${addends[1 - firstIndex]}`,
						answer: bigger + smaller,
					};
				}
			}

			on_change(event) {
				if (this.state.playing_sound) {
					return;
				}

				this.setState({ input: event.target.value });
			}

			on_submit(event) {
				event.preventDefault();

				this.setState({ playing_sound: true });
				if (~~this.state.input == this.state.problem.answer) {
					const sound_effect = new Audio('./success.mp3');
					sound_effect.addEventListener('ended', () => { this.setState({ playing_sound: false, problem: this.generate_problem(), input: '' }); });
					sound_effect.play();
					return;
				}

				const sound_effect = new Audio('./failure.mp3');
				sound_effect.addEventListener('ended', () => { this.setState({ playing_sound: false, input: '' }); });
				sound_effect.play();
			}

		    render(props, state) {
		    	return preact.h(
		    		'form',
		    		{ className: 'centered-flexbox big-text', onSubmit: this.on_submit.bind(this) },
		    		preact.h('span', null, `${state.problem.statement} =`),
		    		preact.h(
		    			'input',
		    			{
		    				type: 'number',
		    				value: state.input,
		    				readonly: this.state.playing_sound,
		    				onChange: this.on_change.bind(this),
		    				autofocus: true,
		    			}
		    		),
		    	);
		    }
		}
	}
)();
