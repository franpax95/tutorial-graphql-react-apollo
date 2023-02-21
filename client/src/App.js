import React, { useState } from 'react';
import AddRecipe from './AddRecipe';
import Recipes from './Recipes';

function App() {
    const [vegetarian, setVegetarian] = useState(false);

    return (
        <div>
            <AddRecipe />

            <br /><hr /><br />

            <label>
                Vegetarian?
                <input type="checkbox" value={vegetarian} onChange={e => setVegetarian(e.target.checked)} />
            </label>
            <Recipes vegetarian={vegetarian} />
        </div>
    );
}

export default App;
