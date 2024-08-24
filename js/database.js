
class ItemDB
{
    //{id:{name, icon, prop, descript}}
    static data = {
        'itempack_0':{name:'紅藥水', icon:'itemPack/itempack_0', prop:{}, descript:'這是紅藥水 this is red potion, this'},
        'itempack_1':{name:'綠藥水', icon:'itemPack/itempack_1', prop:{}, descript:''},
        'itempack_2':{name:'藍藥水', icon:'itemPack/itempack_2', prop:{}, descript:''},
        'itempack_3':{name:'黑藥水', icon:'itemPack/itempack_3', prop:{}, descript:''},
        'itempack_4':{name:'紅蘋果', icon:'itemPack/itempack_4', prop:{}, descript:''},
        'itempack_5':{name:'綠蘋果', icon:'itemPack/itempack_5', prop:{}, descript:''},
        'bomb':{name:'炸彈', icon:'bomb', prop:{}, descript:''},
    };

    static get(id)
    {
        return ItemDB.data[id];
    }
}

class Bag
{
    static items = [{id:'itempack_0', count:2}, 
                    {id:'itempack_1', count:3}, 
                    {id:'itempack_2', count:1}];


    
    static add(id, count)
    {
        let item = Bag.items.find((item) => item.id == id);
        if(item){item.count += count;}
        else{Bag.items.push({id:id, count:count});}
    }

    static remove(id, count)
    {
        while(count > 0)
        {
            let item = Bag.items.find((item) => item.id == id);
            if(item)
            {
                if(item.count > count){item.count -= count; count = 0}
                else
                {   
                    count -= item.count;
                    Bag.items.splice(Bag.items.indexOf(item), 1);
                }
            }
            else{break;}
        }
        return count;
    }
}

class RoleDB
{
    static data = {
        'dude':{name:'dude', icon:'dude/dude_idle', prop:{}, descript:'', anim:{idle:'dude_idle', walk:'dude_walk'}},
    };

    static get(id)
    {
        return RoleDB.data[id];
    }
}