import { Component } from 'react'
import './App.css'
import { IngredientInput } from './components/IngredientInput/IngredientInput'
import { ReceipeSelector } from './components/ReceipeSelector/ReceipeSelector'
import { NotesList } from './components/NotesList/NotesList'

interface AppProps {}
interface AppState {
  receipeFilename: string,
  receipeJSON?: Receipe
}

interface Receipe {
  name: {
    en: string,
    fr: string
  },
  link: {
    en: string,
    fr: string
  }
  ingredients: [
    {
      name: string,
      bakerPercentage: number
    }
  ],
  presetTotalIngredient: number,
  notes: {
    en: Array<string>,
    fr: Array<string>
  }
}

class App extends Component<AppProps, AppState> {
  totalBakerPercentage = 0;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      receipeFilename: '100-pizza-dough'
    };

    this.onChangeReceipe = this.onChangeReceipe.bind(this);
  }

  componentDidMount(): void {
    this.importReceipe(this.state.receipeFilename);
  }

  onChangeReceipe(receipeFilename: string) {
    this.importReceipe(receipeFilename);
  }

  importReceipe(receipeFilename: string) {
    import(`./assets/receipes/${receipeFilename}.json`).then((data: Receipe) => {
      this.setState({
        receipeFilename: receipeFilename,
        receipeJSON: data
      });

      if (!!this.state.receipeJSON) {
        this.totalBakerPercentage = this.state.receipeJSON.ingredients.map(ingredient => (ingredient.bakerPercentage)).reduce((previous, current) => previous+current, 0);
      }
    });
  }

  render() {
    if (!this.state.receipeJSON) {
      return null;
    }

    return <div className="App">
      <ReceipeSelector onChange={this.onChangeReceipe}></ReceipeSelector>
      { !!this.state.receipeJSON.link && !!this.state.receipeJSON.link.fr && <a href={this.state.receipeJSON.link.fr}>Lien</a> }

      {this.state.receipeJSON.ingredients.map(ingredient => (
        <IngredientInput
          key={ingredient.name}
          name={ingredient.name}
          percentage={String(ingredient.bakerPercentage)}
          defaultValue={String(Math.round(this.state.receipeJSON.presetTotalIngredient/this.totalBakerPercentage*ingredient.bakerPercentage))}></IngredientInput>
      ))}
      Total {this.state.receipeJSON.presetTotalIngredient}

      <NotesList notes={this.state.receipeJSON.notes}></NotesList>
    </div>
  }
}

export default App
