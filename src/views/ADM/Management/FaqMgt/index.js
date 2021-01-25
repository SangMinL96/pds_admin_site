import React from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';

import { useQuery } from '@apollo/react-hooks';
import  {FAQContext}  from './FAQContext';
import FAQSearch from './FAQSearch';
import FAQTable from './FAQTable';
import FAQDetail from './FAQDetail';
import { GET_AREA, SVC_CD } from './FAQQuery';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const FAQView = () => {
  const { data: areacode, error } = useQuery(GET_AREA, {
    variables: {
      param: { AREA_TP_CD: '001' },
      ver: 'v1'
    }
  });
  const { data: sve_code } = useQuery(SVC_CD);

  const classes = useStyles();
  return (
    <FAQContext>
      <Page className={classes.root} title="화면 관리">
        <Container maxWidth={false}>
          <Box>
            <FAQSearch sve_code={sve_code} areacode={areacode} />
          </Box>
          <Box mt={1}>
            <FAQTable />
          </Box>
          <Box mt={1}>
            <FAQDetail sve_code={sve_code} />
          </Box>
        </Container>
      </Page>
    </FAQContext>
  );
};

export default FAQView;
