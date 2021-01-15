if __name__ == '__main__':
    from learning.gender import Model, Data

    try:
        print(
            Model(Data('\\database\\raw\\test').prepare())
                .train([1, 0, 1, 0])
                .predict(Data('\\database\\raw\\predict').prepare())
        )
    except Exception as e:
        print('Exception raised while processing: \n\t{}\n\t{}'.format(e, repr(e)))
